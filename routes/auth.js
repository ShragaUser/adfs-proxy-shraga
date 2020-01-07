const Router = require("express").Router;
const passport = require("passport");
const nJwt = require("njwt");
const xmldom = require('xmldom');

const authConfig = require("../authConfig");

const { enrichment, attributeTagName, samlResponseModifier } = authConfig();
//by default enrich is the identity function if undefined
const enrich = enrichment.enrich ? enrichment.enrich : x => x;
const router = Router();

router.get("/saml", passport.authenticate("saml"), (req, res) => {
    res.redirect("/");
});


const dealWithCallback = async (req, res, next) => {
    if (req.cookies["useADFS"]) {
        return next();
    }

    const { user } = req;

    const enrichedUser = await enrich(user, req.cookies.useEnrichId);

    const RelayState = req.cookies["RelayState"];
    if (RelayState) {
        enrichedUser.RelayState = RelayState;
    }

    let jwt = nJwt.create(enrichedUser, Buffer.from(req.cookies["SignInSecret"], 'base64'));
    res.cookie('jwtUserCreds', jwt.compact());

    res.redirect(307, `${req.cookies["callbackURL"]}/?jwt=${jwt.compact()}`);
};

const dealWithSAMLuseADFSCallback = async (req, res, next) => {
    const { SAMLResponse } = req.body;
    const xml = Buffer.from(SAMLResponse, 'base64').toString('utf8');
    const dom = new xmldom.DOMParser().parseFromString(xml);

    const getToNodeValueAndAssignNewValue = async (initialNode, newValueFunc) => {
        while (!initialNode.nodeValue) {
            initialNode = initialNode.childNodes[0];
        }

        const { parentNode } = initialNode;
        parentNode.removeChild(initialNode);
        const newValue = await newValueFunc(initialNode.nodeValue);
        const newElm = dom.createTextNode(newValue);
        parentNode.appendChild(newElm);
        return true;
    }

    const attributes = dom.getElementsByTagName(attributeTagName);
    for (let attributeIndex = 0; attributeIndex < attributes.length; attributeIndex++) {
        for (let attribute in samlResponseModifier) {
            if (attributes[attributeIndex].getAttribute("Name") === attribute) {
                await getToNodeValueAndAssignNewValue(attributes[attributeIndex], samlResponseModifier[attribute]);
            }
        }
    }

    const newSerializedXml = new xmldom.XMLSerializer().serializeToString(dom);
    const newXml = Buffer.from(newSerializedXml, 'utf8').toString('base64');

    const RelayState = req.cookies["RelayState"];

    const createHTMLResponse = (SAMLResponse, callbackURL, RelayState) => {
        const response =
            `<html>
                <body>
                    <form method="POST" name="hiddenform" action="${callbackURL}">
                        <input type="hidden" name="SAMLResponse" value="${SAMLResponse}" />
                        ${ RelayState ? `<input type="hidden" name="RelayState" value="${RelayState}" />` : ''}
                    </form>
                    <script language="javascript">
                        window.setTimeout('document.forms[0].submit()',0);
                    </script>
                </body>
            </html>`

        return response;
    }

    const htlmResponse = createHTMLResponse(newXml, req.cookies["callbackURL"], RelayState);

    res.status(200).send(htlmResponse);
};



const handleWsFedResponse = async (req, res, next) => {
    const generateInputFromParam = (name, value) => `<input type="hidden" name="${name}" value="${value}" />`;
    const generateHTMLFromBody = body => {
        let html = '';
        for (let name in body) {
            html += generateInputFromParam(name, body[name]);
        }
        return html;
    }

    const createHTMLResponse = (callbackURL) => {
        const response =
            `<html>
                <body>
                    <form method="POST" name="hiddenform" action="${callbackURL}">
                        ${generateHTMLFromBody(req.body)}
                    </form>
                    <script language="javascript">
                        window.setTimeout('document.forms[0].submit()',0);
                    </script>
                </body>
            </html>`

        return response;
    };

    const htlmResponse = createHTMLResponse(req.cookies["callbackURL"]);
    return res.status(200).send(htlmResponse);
};

const checkIfResponseIsWsfedOrSaml = async (req, res, next) => (req.body && req.body.wresult) ? handleWsFedResponse(req, res, next) : next();


router.post("/saml", checkIfResponseIsWsfedOrSaml, passport.authenticate("saml"), dealWithCallback);

router.post("/saml", checkIfResponseIsWsfedOrSaml, passport.authenticate("saml"), dealWithSAMLuseADFSCallback);

// to adhere to ADFS standards - not allways relavent.
router.post("/saml/callback", checkIfResponseIsWsfedOrSaml, passport.authenticate("saml"), dealWithCallback);

router.post("/saml/callback", checkIfResponseIsWsfedOrSaml, passport.authenticate("saml"), dealWithSAMLuseADFSCallback);


module.exports = router;
