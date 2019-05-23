var express = require('express');
var router = express.Router();
const axios = require("axios");

router.get('/setCallback/:callbackURL', function (req, res, next) {
  const {
    callbackURL
  } = req.params;
  const {
    SignInSecret
  } = req.query;

  res.cookie("callbackURL", callbackURL);
  res.cookie("SignInSecret", SignInSecret);
  res.status(200).redirect('/auth/saml');
});

module.exports = router;
