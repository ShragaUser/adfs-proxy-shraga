const authConfig = () => {
  const samlResponseModifier = {};
  samlResponseModifier[process.env.PROFILE_EXTRACTOR_ID || "uid"] = async (
    originalValue
  ) => originalValue;
  samlResponseModifier[
    process.env.PROFILE_EXTRACTOR_FIRST_NAME || "email"
  ] = async (originalValue) => `Not ${originalValue}`;
  return {
    required: true,
    secret: process.env.SECRET_KEY || "bLue5tream@2018", // Don't use static value in production! remove from source control!
    saml: {
      entryPoint:
        process.env.SAML_ENTRY_POINT ||
        "http://localhost:8080/simplesaml/saml2/idp/SSOService.php",
      issuer: process.env.SAML_ISSUER || "http://localhost:3000/metadata.xml",
      callbackUrl:
        process.env.SAML_CALLBACK_URL ||
        "http://localhost:3000/auth/saml/callback",
      authnContext:
        "http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows",
      identifierFormat: null,
      signatureAlgorithm: "sha256",
      acceptedClockSkewMs: -1,
    },
    profileExtractor: {
      id: process.env.PROFILE_EXTRACTOR_ID || "uid",
      firstName: process.env.PROFILE_EXTRACTOR_FIRST_NAME || "email",
      lastName: process.env.PROFILE_EXTRACTOR_LAST_NAME || "email",
      email: process.env.PROFILE_EXTRACTOR_MAIL || "email",
      displayName: process.env.PROFILE_EXTRACTOR_DISPLAY_NAME || "email",
    },
    samlResponseModifier,
    attributeTagName: process.env.ATTRIBUTE_TAG || "saml:Attribute",
    samlCallbackUrlTag:
      process.env.SAML_CALLBACK_URL_TAG || "samlp:AuthnRequest",
    samlCallbackAttributeName:
      process.env.SAML_CALLBACK_ATTRIBUTE_NAME || "AssertionConsumerServiceURL",
    enrichment: {
      enrich: "http://enrich:3000/",
      something: async (x, useEnrichId) => {
        const { id, firstName, lastName, email, displayName } = x;
        const name = { firstName, lastName };
        let provider = "ADFS";
        return {
          id,
          name,
          email,
          displayName,
          provider,
        };
      },
      //ideally after enrichment user should be similar to this schema:
      //     provider {String}
      // The provider with which the user authenticated (facebook, twitter, etc.).
      // id {String}
      // A unique identifier for the user, as generated by the service provider.
      // displayName {String}
      // The name of this user, suitable for display.
      // name {Object}
      // familyName {String}
      // The family name of this user, or "last name" in most Western languages.
      // givenName {String}
      // The given name of this user, or "first name" in most Western languages.
      // middleName {String}
      // The middle name of this user.
      // emails {Array} [n]
      // value {String}
      // The actual email address.
      // type {String}
      // The type of email address (home, work, etc.).
      // photos {Array} [n]
      // value {String}
      // The URL of the image.
    },
  };
};

module.exports = authConfig;
