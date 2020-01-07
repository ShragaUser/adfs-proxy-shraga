const express = require('express');
const zlib = require('zlib');
const R = require('ramda');
const xmldom = require('xmldom');
const { promisify } = require('util');
const { trycatch } = require('../utils/util');
const { samlCallbackUrlTag, samlCallbackAttributeName, saml } = require("../authConfig")();
const { entryPoint } = saml;
const router = express.Router();

const clearCookies = res => {
  const cookies = [
    'callbackURL',
    'SignInSecret',
    'useEnrichId',
    'useADFS',
    'RelayState'
  ];
  cookies.forEach(cookie => res.clearCookie(cookie));
};

router.get('/setCallback/:callbackURL', function (req, res, next) {
  const { callbackURL } = req.params;
  const {
    SignInSecret,
    useEnrichId,
    useADFS,
    RelayState
  } = req.query;

  clearCookies(res);

  if (callbackURL) {
    res.cookie("callbackURL", callbackURL);
  }

  if (SignInSecret) {
    res.cookie("SignInSecret", SignInSecret);
  }

  if (useEnrichId) {
    res.cookie("useEnrichId", useEnrichId);
  }

  if (useADFS) {
    res.cookie("useADFS", useADFS);
  }

  if (RelayState) {
    res.cookie("RelayState", RelayState);
  }

  return res.status(200).redirect('/auth/saml');
});

const getBufferFromBase64 = async base64 => Buffer.from(base64, 'base64');
const zlibInflateRaw = promisify(zlib.inflateRaw);
const getZlibInflatedBuffer = buffer => zlibInflateRaw(buffer);
const utf8FromBuffer = async buffer => Buffer.from(buffer).toString('utf8');

const getCallbackUrlFromXML = xmlString => {
  const dom = new xmldom.DOMParser().parseFromString(xmlString);
  const authRequestTag = dom.getElementsByTagName(samlCallbackUrlTag);
  for (let index = 0; index < authRequestTag.length; index++) {
    const callbackUrl = authRequestTag[index].getAttribute(samlCallbackAttributeName);
    if (callbackUrl) {
      return callbackUrl;
    }
  }
  return null;
}


const handleSAMLRequest = async (req, res) => {
  const getSamlRequestXMLString = trycatch(R.pipeWith(R.then, [getBufferFromBase64, getZlibInflatedBuffer, utf8FromBuffer]));
  const { error, result: samlRequestXMLString } = await getSamlRequestXMLString(req.query.SAMLRequest);
  if (error) {
    return res.status(500).send('Cannot Parse SAMLRequest');
  }
  if (samlRequestXMLString) {
    const callbackURL = getCallbackUrlFromXML(samlRequestXMLString);
    if (callbackURL) {
      res.cookie("callbackURL", callbackURL);
      res.cookie("useADFS", true);
      return res.status(200).redirect('/auth/saml');
    }
    return res.status(500).send('Cannot Establish Callback URL');
  }
};


const getQueryStringFromQuery = query => {
  let queryString = '?';
  for (let param in query) {
    queryString += `${param}=${query[param]}&`;
  }
  return queryString;
};

const handleWsFedRequest = async (req, res) => {
  const { wtrealm: callbackURL } = req.query;
  res.cookie("callbackURL", callbackURL);
  const wtrealmCallbackUrl = `${req.protocol}://${req.get("host")}/auth/saml/callback`;
  const query = { ...req.query, wtrealm: wtrealmCallbackUrl };
  const queryString = getQueryStringFromQuery(query);
  return res.redirect(`${entryPoint}${queryString}`);
};

router.get('/saml', async (req, res, next) => {
  clearCookies(res);

  if (req.query && req.query.SAMLRequest) {
    return handleSAMLRequest(req, res);
  };

  if (req.query && req.query.wa) {
    return handleWsFedRequest(req, res);
  }

  return res.status(500).send('Not a valid SAML Request');

});

module.exports = router;
