# [Shraga](https://Shragajs.org/)

Shraga is a JavaScript library for building user interfaces.

----

* **What:** Shraga makes it painless to create interactive UIs. Design simple views for each state in your application, and Shraga will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable, simpler to understand, and easier to debug.

----

* **Why:** Build encapsulated components that manage their own state, then compose them to make complex UIs. Since component logic is written in JavaScript instead of templates, you can easily pass rich data through your app and keep state out of the DOM.

----

* **How:** We don't make assumptions about the rest of your technology stack, so you can develop new features in Shraga without rewriting existing code. Shraga can also render on the server using Node and power mobile apps using [Shraga Native](https://facebook.github.io/Shraga-native/).


---

## Setup

----

### Development

- Docker: ```run-docker```
- local: run [SAML DOCKER] + npm i 

### Production

- configure SAML idp
- configure enrich function
- configure claims mapper


```
code to use for saml and configuration
```

---

## Documentation

You can find the Shraga documentation [on the website](https://Shragajs.org/docs).  

Check out the [Getting Started](https://Shragajs.org/docs/getting-started.html) page for a quick overview.

----

The documentation is divided into several sections:

* [Tutorial](https://Shragajs.org/tutorial/tutorial.html)
* [Main Concepts](https://Shragajs.org/docs/hello-world.html)
* [Advanced Guides](https://Shragajs.org/docs/jsx-in-depth.html)
* [API Reference](https://Shragajs.org/docs/Shraga-api.html)
* [Where to Get Support](https://Shragajs.org/community/support.html)
* [Contributing Guide](https://Shragajs.org/docs/how-to-contribute.html)

You can improve it by sending pull requests to [this repository](https://github.com/Shragajs/Shragajs.org).

---

## Examples

We have several examples [on the website](https://Shragajs.org/). Here is the first one to get you started:

```jsx
function HelloMessage({ name }) {
  return <div>Hello {name}</div>;
}

ShragaDOM.render(
  <HelloMessage name="Taylor" />,
  document.getElementById('container')
);
```

This example will render "Hello Taylor" into a container on the page.

----

You'll notice that we used an HTML-like syntax; [we call it JSX](https://Shragajs.org/docs/introducing-jsx.html). JSX is not required to use Shraga, but it makes code more readable, and writing it feels like writing HTML. If you're using Shraga as a `<script>` tag, read [this section](https://Shragajs.org/docs/add-Shraga-to-a-website.html#optional-try-Shraga-with-jsx) on integrating JSX; otherwise, the [recommended JavaScript toolchains](https://Shragajs.org/docs/create-a-new-Shraga-app.html) handle it automatically.

---

## Contributing

The main purpose of this repository is to continue to evolve Shraga core, making it faster and easier to use. Development of Shraga happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Shraga.

---

### [Code of Conduct](https://code.fb.com/codeofconduct)

Facebook has adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](https://code.fb.com/codeofconduct) so that you can understand what actions will and will not be tolerated.

---

### [Contributing Guide](https://Shragajs.org/contributing/how-to-contribute.html)

Read our [contributing guide](https://Shragajs.org/contributing/how-to-contribute.html) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Shraga.

---

### Good First Issues

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/facebook/Shraga/labels/good%20first%20issue) that contain bugs which have a relatively limited scope. This is a great place to get started.

### License

Shraga is [MIT licensed](./LICENSE).