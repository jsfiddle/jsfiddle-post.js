# jsfiddle-post.js

As opposed to [JSFiddle embeds](https://medium.com/jsfiddle-updates/new-jsfiddle-embeds-93ab7a51ee11)
where the code is fully hosted on JSFiddle and embedded on a website,
`jsfiddle-post.js` (basd on our [Post API](http://doc.jsfiddle.net/api/post.html)) simply sends and
renders the code hosted on your website in JSFiddle.

## Setup

1. Put `<script defer src="//jsfiddle.net/js/jsfiddle-post.js"></script>` somewhere on your website
2. Add special attributes to your elements containing code:

   ```html
   <pre data-playground-type="html" data-playground-group="code-example-1">
    <p>Hello world!</p>
   </pre>
   ```

   ```html
   <pre data-playground-type="scss" data-playground-group="code-example-1">
    p {
      color: rgba(#ff0000, 0.5);
    }
   </pre>
   ```

3. Add the `Edit in JSFiddle` button

   ```html
   <a href="#"
    data-playground="jsfiddle"
    data-playground-from-group="code-example-1">Edit in JSFiddle</a>
   ```

## Options

### For code snippet

Both attributes are **required**.

Attribute  | Possible values | Description
---------- | --------------- | -----------
`data-playground-type` | `css`, `scss`, `html`, `javascript`, `coffeescript`, `javascript1.7`, `babel`, `typescript` | Type of the code
`data-playground-group` | | Unique group ID for a set code snippets

### For edit button

Only the marked are required.

Attribute  | Possible values | Description
---------- | --------------- | -----------
`data-playground` | `jsfiddle` | (Required) Define playground.
`data-playground-from-group` | | (Required) Unique group ID for a set code snippets.
`data-playground-title` | | Title of the fiddle.
`data-playground-description` | | Description of the fiddle.
`data-playground-resources` | | Comma separated list of resources to load along the fiddle. Full URLs.
`data-playground-dtd` | `html 5`, `html 4`, `...` | Substring of a DTD.
`data-playground-wrap` | `l`, `d`, `h`, `b` | Load type. onLoad, onDomReady, in `<head>`, in `<body>`.
`data-playground-normalize` | `yes`, `no` | Should JSFiddle normalize your CSS.
`data-playground-framework` | | Substring of a framework name. For example `jquery` will resolve into `jQuery`.
`data-playground-framework-version` | | Substring of the framework version - the last passing will be used. If 1.3 will be given, JSFiddle will use the latest matching result, it'll favorize 1.3.2 over 1.3.1 and 1.3.
`data-playground-dependencies` | | Comma separated list of dependency substrings. For example `ui` will resolve into `jQuery UI`. Be sure to check what dependencies are available in JSFiddle first.
