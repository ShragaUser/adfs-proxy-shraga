const Router = require("express").Router;
const passport = require("passport");
const nJwt = require("njwt");

const router = Router();

router.get("/saml", passport.authenticate("saml"), (req, res) => {
    res.redirect("/");
});

router.post("/saml", passport.authenticate("saml"), (req, res) => {
    let {
        user
    } = req;

    user = process.env.enrichUrl?enrichUser(user):user;

    let jwt = nJwt.create(user, Buffer.from(req.cookies["SignInSecret"], 'base64'));
    res.cookie('jwtUserCreds', jwt.compact());

    res.redirect(307, req.cookies["callbackURL"]);
});

function enrichUser(user) {
    //TODO: enrichment
    return user;
}


module.exports = router;