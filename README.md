# [Shraga](https://shragauser.github.io/adfs-proxy/)

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

### Development

- Docker: ```docker-compose -f "docker-compose.yml" up -d --build```
- local: run [SAML DOCKER] + npm i + npm start 

### Production

- configure SAML idp
- configure enrich function
- configure claims mapper


```
TODO:code to use for saml and configuration
```

---

## Contributing

The main purpose of this repository is to continue to evolve Shraga core, making it faster and easier to use. Development of Shraga happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Shraga.

---

### License

Shraga is [MIT licensed](./LICENSE).