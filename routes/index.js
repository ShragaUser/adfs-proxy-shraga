var express = require('express');
var router = express.Router();
const axios = require("axios");
const secureRandom = require('secure-random');


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.cookies);
  axios.post(req.cookies["callbackURL"]).then(() => console.log('s')).catch((err) => console.error(err));
  //res.status(200).redirect(req.cookies["callbackURL"]);
  // res.json(JSON.stringify(req.user));

});

router.get('/setCallback/:callbackURL', function (req, res, next) {
  const callbackURL = req.params.callbackURL;
  const signInSecret = secureRandom(256, {
    type: 'Buffer'
  });
  var base64SigningKey = signInSecret.toString('base64');
  res.cookie("callbackURL", callbackURL);
  res.cookie("SignInSecret", base64SigningKey);
  res.status(200).redirect('/auth/saml');
  // res.json(JSON.stringify(req.user));

});

module.exports = router;