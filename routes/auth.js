const Router = require("express").Router;
const passport = require("passport");
const nJwt = require("njwt");

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

router.post("/saml", passport.authenticate("saml"), async (req, res) => {
    let {
        user
    } = req;
    
    user = await enrich(user, req.cookies.useEnrichId);

    let jwt = nJwt.create(user, Buffer.from(req.cookies["SignInSecret"], 'base64'));
    res.cookie('jwtUserCreds', jwt.compact());

    res.redirect(307, `${req.cookies["callbackURL"]}/?jwt=${jwt.compact()}`);
});


module.exports = router;
