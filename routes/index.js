var express = require('express');
var router = express.Router();
const axios = require("axios");
const secureRandom = require('secure-random');

const generateRandomBuffer = ()=>secureRandom(256, {
  type: 'Buffer'
});
const generateBase64SigningKey= ()=>generateRandomBuffer().toString('base64');

router.get('/', function (req, res, next) {
  axios.post(req.cookies["callbackURL"]).then(() => console.log('s')).catch((err) => console.error(err));
});

router.get('/setCallback/:callbackURL', function (req, res, next) {
  const { callbackURL } = req.params;
  const base64SigningKey = generateBase64SigningKey()
  res.cookie("callbackURL", callbackURL);
  res.cookie("SignInSecret", base64SigningKey);
  res.status(200).redirect('/auth/saml');
});

module.exports = router;