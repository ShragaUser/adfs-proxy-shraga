const passport = require("passport");
const { Strategy: SamlStrategy } = require("passport-saml");
const dotenv = require("dotenv");
const authConfig = require("./authConfig");

dotenv.config();

let users = [];

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  const user =
    users.filter(user => user.id === id).length > 0
      ? users.filter(user => user.id === id)[0]
      : {};
  cb(null, user);
});

const configurePassport = db => {
  const { saml: samlConfig, profileExtractor } = authConfig();
  passport.use(
    new SamlStrategy(samlConfig, (profile, done) => {
      profile = {
        id: profile[profileExtractor.id],
        firstName: profile[profileExtractor.firstName],
        lastName: profile[profileExtractor.lastName],
        displayName: profile[profileExtractor.displayName],
        mail: profile[profileExtractor.mail]
      };
      if (users.filter(user => user.id === profile.id).length === 0) {
        users.push(profile);
      }
      done(null, profile);
    })
  );
};

module.exports = configurePassport;
