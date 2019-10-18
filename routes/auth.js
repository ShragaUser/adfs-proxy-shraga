const Router = require("express").Router;
const passport = require("passport");
const nJwt = require("njwt");
const xmldom = require('xmldom');
const fromDataCreator = require("form-data");
const axios = require("axios");

const authConfig = require("../authConfig");

const {
    enrichment
} = authConfig();
//by default enrich is the identity function if undefined
const enrich = enrichment.enrich ? enrichment.enrich : x => x;
const router = Router();

router.get("/saml", passport.authenticate("saml"), (req, res) => {
    res.redirect("/");
});

router.post("/saml", passport.authenticate("saml"), async (req, res, next) => {
    if (req.cookies["useADFS"]) {
        return next();
    }

    const { user } = req;

    const enrichedUser = await enrich(user, req.cookies.useEnrichId);

    let jwt = nJwt.create(enrichedUser, Buffer.from(req.cookies["SignInSecret"], 'base64'));
    res.cookie('jwtUserCreds', jwt.compact());

    res.redirect(307, `${req.cookies["callbackURL"]}/?jwt=${jwt.compact()}`);

});

router.post("/saml", passport.authenticate("saml"), async (req, res, next) => {
    const { SAMLResponse } = req.body;
    const xml = Buffer.from(SAMLResponse, 'base64').toString('utf8');
    const dom = new xmldom.DOMParser().parseFromString(xml);

    const getToNodeValueAndAssignNewValue = (initialNode, newValue) => {
        while (!initialNode.nodeValue) {
            initialNode = initialNode.childNodes[0];
        }

        const { parentNode } = initialNode;
        parentNode.removeChild(initialNode);
        const newElm = dom.createTextNode(newValue);
        parentNode.appendChild(newElm);
    }

    const attributes = dom.getElementsByTagName("saml:Attribute");
    for (let attributeIndex = 0; attributeIndex < attributes.length; attributeIndex++) {
        if (attributes[attributeIndex].getAttribute("Name") === "uid") {
            getToNodeValueAndAssignNewValue(attributes[attributeIndex], 2);
        }
        if (attributes[attributeIndex].getAttribute("Name") === "email") {
            getToNodeValueAndAssignNewValue(attributes[attributeIndex], "doodido");
        }
    }

    const newSerializedXml = new xmldom.XMLSerializer().serializeToString(dom);
    const newXml = Buffer.from(newSerializedXml, 'utf8').toString('base64');

    const fromData = new fromDataCreator();
    fromData.append("SAMLResponse", newXml);

    const htlmResponse = createHTMLResponse(newXml, req.cookies["callbackURL"]);

    res.status(200).send(htlmResponse);
});


const createHTMLResponse = (SAMLResponse, callbackURL) => {
    const response =
        `<html>
            <body>
                <form method="POST" name="hiddenform" action="${callbackURL}">
                    <input type="hidden" name="SAMLResponse" value="${SAMLResponse}" />
                </form>
                <script language="javascript">
                    window.setTimeout('document.forms[0].submit()',0);
                </script>
            </body>
        </html>`

    return response;
}


module.exports = router;
