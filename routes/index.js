var express = require('express');
var router = express.Router();
const axios = require("axios");

router.get('/setCallback/:callbackURL', function (req, res, next) {
  const {
    callbackURL
  } = req.params;
  const {
    SignInSecret,
    useEnrichId,
    useADFS
  } = req.query;

  res.cookie("callbackURL", callbackURL);

  res.cookie("SignInSecret", SignInSecret);

  if (SignInSecret) {
    res.cookie("SignInSecret", SignInSecret);
  } else {
    res.clearCookie("SignInSecret");
  }

  if (useEnrichId) {
    res.cookie("useEnrichId", useEnrichId);
  } else {
    res.clearCookie("useEnrichId");
  }

  if (useADFS) {
    res.cookie("useADFS", useADFS);
  } else {
    res.clearCookie("useADFS");
  }

  res.status(200).redirect('/auth/saml');
});

module.exports = router;
