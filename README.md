# [Shraga](https://shragauser.github.io/adfs-proxy-shraga/)

Shraga is a saml authentication proxy.

Technology Stack:
* SAML
* passport.js
* JWT
* Express.js

----

* **What:** Shraga makes it painless to authenticate applications over saml protocol.
It standardizes the user profile returned from the saml-idp by following this [schema](https://tools.ietf.org/html/draft-smarr-vcarddav-portable-contacts-00).
Additionally it allows enriching the user`s profile from other services before returning to your applications.

----

* **Why:** Prevents from reconfiguring your apps directly in the ADFS or the saml-idp over and over for every app, and provides a centrelized standardized "idp-proxy", and dealing with metadata.xml or relying party.

----

* **How:** Instead of configuring the authentication directly to your app you forward to adfs-proxy and after the user is authenticated he is redirected back to adfs-proxy and a JWT is returned to your app.


---

## Setup

----
#### Dependencies:
* ADFS must be enabled and running. in development a sample SAML-idp can be used - [saml-idp docker](https://github.com/kristophjunge/docker-test-saml-idp).
* [MongoDB](https://www.mongodb.com/) instance must be provided via .env or docker-compose variables ( for session management)

----

#### Easy-Setup:
use image based docker-compose that creates a Plug-and-Play saml-idp and the adfs-proxy (Shraga) on a single container. 

```
cd  ./compose
docker-compose -f "docker-compose.yml" up -d --build
```

----

#### Manual-Setup:
you must connect Shraga to a SAML-IDP. this can be an Enterprise ADFS in an inside organization or via a local development saml-idp as shown in the dependecies doc.

----

#### Docker:

 ```
 docker-compose -f "docker-compose.yml" up -d --build
 ```

 change environment variables in the docker-compose.yml to your needs. 

----
#### Local: 
create .env file containing the following configurations

if no .env file exists default values will be used.
```
# MongoDB is required for session management
MONGODB_URL
MONGODB_NAME

# important - can be any value
SESSION_SECRET

# for ADFS only:
SAML_ENTRY_POINT
SAML_ISSUER
SAML_CALLBACK_URL

# for ADFS claims:
# the names of the claims returned by the ADFS
PROFILE_EXTRACTOR_ID
PROFILE_EXTRACTOR_FIRST_NAME
PROFILE_EXTRACTOR_LAST_NAME
PROFILE_EXTRACTOR_MAIL
PROFILE_EXTRACTOR_DISPLAY_NAME
```

----

### Enrichment
In order to incorporate enrichment to the user profile recieved from the saml-idp you need to edit the "authConfig.js" file and write a function to replace the "enrich" function.

default function is an identity function:
```
enrich: x=>x;
```
enrich can be a sync/async function and will allways be dealt with "await". 

----

### SAML-Response Manipulation
If usage of the SAML IDP SAMLResponse is needed ( ie. ADFS SAMLRespone Form Data in HTML POST):


Send initial request to /setCallback with param 'useADFS=true'.

If useADFS is sent adfs-proxy-shraga will return the SAMLResponse to given callbackURL.

----

#### If using passport-saml

if using [passport-saml](https://github.com/bergie/passport-saml) make sure to set {entryPoint} to be: 

```
const entryPoint = `${ADFS-PROXY-URL}/setCallback/${encodeURIComponent(SAML_CALLBACK_URL)}?useADFS=true`
```

----

#### Manipulating SAML Claims

SAML Claims can be changed before being sent back to client ( callbackURL ).

in authConfig: configure ```samlResponseModifier```

```samlResponseModifier``` is a map of Claim names to Manipulation Functions. 

For Example:

```
  samlResponseModifier: {
    "uid": async (originalValue) => originalValue,
    "email": async (originalValue) => "not Original value"
  }
```

----
### Run Server: 
```
run: npm start
```


---

## Optional Params

----

  ```SignInSecret```: When using Shraga as a jwt IDP then SignInSecret is a MUST HAVE parameter. This is a base64 encoded secret to sign jwt object with.

  ```useEnrichId```: When using Shraga as a jwt IDP then if 'useEnrichId' is truthy then the 'id' property of the user profile will be changed to the id recieved from the 'enrich' function. ( useEnrichId value will be sent to enrich function - behaviour is decided by the function ).

----

  ```useADFS```: If useADFS is truthy then Shraga will return the SAMLReponse ( modified by Shraga - explanation above ) directly to 'callbackUrl'. jwt will not be used.

  ```RelayState```: RelayState value will be added to SAMLResponse Form Data if useADFS is truthy and be added to jwtBody otherwise. if RelayState is undefined value will not be added at all.

---

## Application Implementation

----
### passport-shraga

[passport-shraga](https://github.com/ShragaUser/passport-shraga) is a [passport.js](http://www.passportjs.org/) authentication strategy that utilizes Shraga as an saml-idp proxy. 

it is also availabe as an npm module and can ve installed using: 
```
npm i --save passport-shraga
```

----
### passport.js

usage of passport-shraga is as followed:

```
const passport = require("passport");
const { Strategy } = require("passport-shraga");

passport.serializeUser((user, cb) => {
    //serialize function
});

passport.deserializeUser((id, cb) => {
    ///deserialize function
});

passport.use(new Strategy({}, (profile, done) => {
    console.log(`My Profile Is: ${profile}`);
    done(null, profile);
}))
```

----
### shraga-example

[shraga-example](https://github.com/ShragaUser/shraga-example) is an End-2-End implementation of an express.js app using [passport-shraga](https://github.com/ShragaUser/passport-shraga) to authenticate users via Shraga (adfs-proxy). 

It can be used as a reference point for configuring an app to use Shraga.

---

## Contributing

The main purpose of this repository is to continue to evolve Shraga core, making it faster and easier to use. Development of Shraga happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Shraga.

---

### License

Shraga is [MIT licensed](./LICENSE).