const passport = require("passport");
const { Strategy: SamlStrategy } = require("passport-saml");
const dotenv = require("dotenv");
const authConfig = require("./authConfig");

//checks if func is a function
const isFunction = (func)=>func instanceof Function;
//extracts claims from profile by profileExtractor object keys
const extract = (profile,profileExtractor)=>{
  let res = {}
  Object.keys(profileExtractor).forEach(key=>
    res[key]=profile[profileExtractor[key]]
  )
  return res;
}

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
      //if profileExtractor is provided as a function use it to extract profile
      //else assume its an object whos keys are the profiles keys and the values are the keys in
      //the provided profile from saml
      profile = isFunction(profileExtractor)?
      profileExtractor(profile)
      :extract(profile,profileExtractor)
      if (users.filter(user => user.id === profile.id).length === 0) {
        users.push(profile);
      }
      done(null, profile);
    })
  );
};

module.exports = configurePassport;
