(function() {
  var Helpers, JSFiddlePost,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeList.prototype.eachElement = Array.prototype.forEach;

  Helpers = (function() {
    function Helpers() {
      this.addDelegation = bind(this.addDelegation, this);
    }

    Helpers.prototype.del = function(obj, key) {
      var val;
      val = obj[key];
      delete obj[key];
      return val;
    };

    Helpers.prototype.extend = function(object, properties) {
      var key, val;
      for (key in properties) {
        val = properties[key];
        object[key] = val;
      }
      return object;
    };

    Helpers.prototype.merge = function(options, overrides) {
      return this.extend(this.extend({}, options), overrides);
    };

    Helpers.prototype.addEvent = function(element, event, fn, useCapture) {
      if (useCapture == null) {
        useCapture = false;
      }
      return element.addEventListener(event, fn, useCapture);
    };

    Helpers.prototype.addDelegation = function(event, fn, useCapture) {
      if (useCapture == null) {
        useCapture = false;
      }
      return document.body.addEventListener(event, (function(_this) {
        return function(event) {
          var element, ref;
          element = event.target;
          while (element && !((ref = element.dataset) != null ? ref.playground : void 0)) {
            element = element.parentNode;
          }
          if (element) {
            return fn.call(_this, element);
          }
        };
      })(this), useCapture);
    };

    return Helpers;

  })();

  JSFiddlePost = (function(superClass) {
    extend(JSFiddlePost, superClass);

    function JSFiddlePost() {
      this.translateLanguageToBase = bind(this.translateLanguageToBase, this);
      this.collectEachCode = bind(this.collectEachCode, this);
      this.collectEachSnippet = bind(this.collectEachSnippet, this);
      this.collectSnippets = bind(this.collectSnippets, this);
      this.createForm = bind(this.createForm, this);
      this.attachEvents = bind(this.attachEvents, this);
      this.setupDefaults = bind(this.setupDefaults, this);
      this.snippets = {};
      this.languages = {
        html: ["html"],
        js: ["javascript", "coffeescript", "javascript1.7", "babel", "typescript"],
        css: ["css", "scss"]
      };
      this.elements = {
        playground: document.querySelectorAll("*[data-playground=jsfiddle]")
      };
      this.setupDefaults();
    }

    JSFiddlePost.prototype.setupDefaults = function() {
      this.collectSnippets();
      this.attachEvents();
      return console.log(this.snippets);
    };

    JSFiddlePost.prototype.attachEvents = function() {
      return this.addDelegation("click", this.createForm);
    };

    JSFiddlePost.prototype.createForm = function(element) {
      var form, group, input, key, ref, snippet, value;
      group = element.dataset.playgroundFromGroup;
      snippet = this.snippets[group];
      form = document.createElement("form");
      form.method = "post";
      form.action = this.createUrl(snippet);
      form.target = "_blank";
      ref = snippet.params;
      for (key in ref) {
        value = ref[key];
        if (value) {
          input = document.createElement("input");
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      }
      return form.submit();
    };

    JSFiddlePost.prototype.collectSnippets = function() {
      return this.elements.playground.eachElement(this.collectEachSnippet);
    };

    JSFiddlePost.prototype.collectEachSnippet = function(element) {
      var group, panes, params, url;
      this.currentSnippet = {};
      group = element.dataset.playgroundFromGroup;
      params = {
        title: element.dataset.playgroundTitle || null,
        description: element.dataset.playgroundDescription || null,
        resources: element.dataset.playgroundResources || null,
        dtd: element.dataset.playgroundDtd || "html 5",
        wrap: element.dataset.playgroundWrap || "l",
        normalize_css: element.dataset.playgroundNormalize || "yes"
      };
      url = {
        framework: element.dataset.playgroundFramework || null,
        version: element.dataset.playgroundFrameworkVersion || null,
        dependencies: element.dataset.playgroundDependencies || ""
      };
      panes = document.querySelectorAll("*[data-playground-group=" + group + "]");
      panes.eachElement(this.collectEachCode);
      this.snippets[group] = {};
      this.snippets[group]["url"] = url;
      return this.snippets[group]["params"] = this.merge(params, this.currentSnippet);
    };

    JSFiddlePost.prototype.collectEachCode = function(element) {
      var code, subtype, type;
      code = element.innerHTML;
      subtype = element.dataset.playgroundType;
      type = this.translateLanguageToBase(subtype);
      this.currentSnippet[type] = this.cleanupCode(code);
      return this.currentSnippet["panel_" + type] = this.translateLanguageToId(type, subtype);
    };

    JSFiddlePost.prototype.createUrl = function(snippet) {
      var dependencies, deps, framework, fwv, ref, url, version;
      ref = [snippet.url.framework, snippet.url.version, snippet.url.dependencies], framework = ref[0], version = ref[1], dependencies = ref[2];
      if (!framework) {
        fwv = "library/pure";
      } else {
        fwv = framework + "/" + version;
      }
      if (!dependencies) {
        deps = dependencies;
      } else {
        deps = "dependencies/" + dependencies + "/";
      }
      return url = "//jsfiddle.net/api/post/" + fwv + "/" + deps;
    };

    JSFiddlePost.prototype.translateLanguageToId = function(scope, lookup) {
      return this.languages[scope].indexOf(lookup);
    };

    JSFiddlePost.prototype.translateLanguageToBase = function(lookup) {
      var base, key, ref, value;
      base = "";
      ref = this.languages;
      for (key in ref) {
        value = ref[key];
        if (value.indexOf(lookup) >= 0) {
          base = key;
        }
      }
      return base;
    };

    JSFiddlePost.prototype.cleanupCode = function(code) {
      var text;
      text = document.createElement("textarea");
      text.innerHTML = code;
      return text.value;
    };

    return JSFiddlePost;

  })(Helpers);

  document.addEventListener("DOMContentLoaded", function() {
    return new JSFiddlePost;
  });

}).call(this);
