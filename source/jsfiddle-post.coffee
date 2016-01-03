# TODO: make this safe - currently overwrites prototype
NodeList::eachElement = Array::forEach

class Helpers

  del: (obj, key) ->
    val =  obj[key]
    delete obj[key]
    val

  extend: (object, properties) ->
    for key, val of properties
      object[key] = val
    object

  merge: (options, overrides) ->
    @extend (@extend {}, options), overrides

  addEvent: (element, event, fn, useCapture = false) ->
    element.addEventListener event, fn, useCapture

  # very basic event delegation
  addDelegation: (event, fn, useCapture = false) =>
    document.body.addEventListener event, (event) =>
      element = event.target

      while element and not element.dataset?.playground
        element = element.parentNode

      fn.call @, element if element
    , useCapture

class JSFiddlePost extends Helpers

  constructor: ->

    # main config
    @snippets = {}

    # language mapping
    @languages =
      html: ["html"]
      js:   ["javascript", "coffeescript", "javascript1.7", "babel", "typescript"]
      css:  ["css", "scss"]

    # elements
    @elements =
      playground: document.querySelectorAll "*[data-playground=jsfiddle]"

    @setupDefaults()

  setupDefaults: =>
    @collectSnippets()
    @attachEvents()

    console.log @snippets

  attachEvents: =>
    @addDelegation "click", @createForm

  createForm: (element) =>
    group   = element.dataset.playgroundFromGroup
    snippet = @snippets[group]

    form = document.createElement "form"
    form.method = "post"
    form.action = @createUrl snippet
    form.target = "_blank"

    for key, value of snippet.params
      if value
        input = document.createElement "input"
        input.name  = key
        input.value = value

        form.appendChild input

    # there's a chance some browsers need the form to be injected
    # document.body.appendChild form
    form.submit()

    # remove the form just so it's more sanitary around here
    # form.parentNode.removeChild form

  collectSnippets: =>
    @elements.playground.eachElement @collectEachSnippet

  collectEachSnippet: (element) =>
    @currentSnippet = {}

    group  = element.dataset.playgroundFromGroup
    params =
      title:         element.dataset.playgroundTitle            or null
      description:   element.dataset.playgroundDescription      or null
      resources:     element.dataset.playgroundResources        or null
      dtd:           element.dataset.playgroundDtd              or "html 5"
      wrap:          element.dataset.playgroundWrap             or "l"
      normalize_css: element.dataset.playgroundNormalize        or "yes"
    url =
      framework:     element.dataset.playgroundFramework        or null
      version:       element.dataset.playgroundFrameworkVersion or null
      dependencies:  element.dataset.playgroundDependencies     or ""

    panes = document.querySelectorAll "*[data-playground-group=#{group}]"
    panes.eachElement @collectEachCode
    @snippets[group]           = {}
    @snippets[group]["url"]    = url
    @snippets[group]["params"] = @merge params, @currentSnippet

  # collect all code snippets and push into the main confi object
  collectEachCode: (element) =>
    code    = element.innerHTML
    subtype = element.dataset.playgroundType

    # translate subtype to base type, like:
    # scss -> css, babel -> javascript
    type = @translateLanguageToBase subtype
    @currentSnippet[type] = @cleanupCode code

    # store subtype ID for panel
    @currentSnippet["panel_#{type}"] = @translateLanguageToId type, subtype

  # create the form URL from snippet configuration
  createUrl: (snippet) ->
    [framework, version, dependencies] = [snippet.url.framework, snippet.url.version, snippet.url.dependencies]

    # compose the framework + version part of the URL
    if not framework
      fwv = "library/pure"
    else
      fwv = "#{framework}/#{version}"

    # dependencies part of the URL
    if not dependencies
      deps = dependencies
    else
      deps = "dependencies/#{dependencies}/"

    url = "//jsfiddle.net/api/post/#{fwv}/#{deps}"

  # translate subtype to its ID
  translateLanguageToId: (scope, lookup) ->
    @languages[scope].indexOf lookup

  # look for the subtype in languages definition and return the key/base
  translateLanguageToBase: (lookup) =>
    base = ""
    for key, value of @languages
      base = key if value.indexOf(lookup) >= 0
    base

  # clean up entities
  cleanupCode: (code) ->
    text = document.createElement "textarea"
    text.innerHTML = code
    text.value

document.addEventListener "DOMContentLoaded", ->
  new JSFiddlePost
