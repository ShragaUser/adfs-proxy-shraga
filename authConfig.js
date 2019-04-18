const authConfig = () =>
    ({
        required: true,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018', // Don't use static value in production! remove from source control!
        saml: {
            entryPoint: process.env.SAML_ENTRY_POINT || 'http://localhost:8080/simplesaml/saml2/idp/SSOService.php',
            issuer: process.env.SAML_ISSUER || 'http://localhost:3000/metadata.xml',
            callbackUrl: process.env.SAML_CALLBACK_URL || 'http://localhost:3000/auth/saml/callback',
            authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
            identifierFormat: null,
            signatureAlgorithm: 'sha256',
            acceptedClockSkewMs: -1,
        },
        profileExtractor: {
            id: process.env.PROFILE_EXTRACTOR_ID || 'uid',
            firstName: process.env.PROFILE_EXTRACTOR_FIRST_NAME || 'email',
            lastName: process.env.PROFILE_EXTRACTOR_LAST_NAME || 'email',
            mail: process.env.PROFILE_EXTRACTOR_MAIL || 'email',
            displayName: process.env.PROFILE_EXTRACTOR_DISPLAY_NAME || 'email'
        }
    });


module.exports = authConfig;