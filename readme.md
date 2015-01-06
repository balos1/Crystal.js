Crystal.js
---
##### Version v0.2.0
##### See it in action at http://cojomojo.github.io/Crystal.js/

## A lightweight Javascript inline/live form validator
+ 4KB minified 
+ No JQuery.

## Getting Started
1. Download or clone Crystal.js and include it in your HTML markup.
    
    ```html
    <script type='text/javascript' src='/path/to/crystal.min.js'></script>
    ```

2. Add the necessary HTML markup to input and textarea elements you want to apply Crystal to. You'll just have to add a data attribute `data-crystal` with the value begin the kind of field it is (e.g. a name field, email, etc.). You'll be creating validation rules using this value later on.
    
    ```html
    <input data-crystal="name" type="text">
    ```

3. Add the CSS

    ```css
    .crystal-invalid {
        border: 2px solid #f15b22 !important;
    }
    ```

4. Instantiate Crystal. The constructor takes one parameter, the parent node for all forms you want to apply Crystal to. By default this is `document`. 

    ```javascript
    var crystal = new Crystal();
    // OR somethiing like this
    var crystal = new Crystal(document.getElementById("demo1"));
    ```

## Creating Validation Rules
The flexibility of Crystal.js is because it allows for you to define the validation rules. It is very simple, just use the method `setCrystalFieldConfig`.

```javascript
/**
 * Sets the configurable parts of the 
 * @param {int | int array | "all"} [id] the "data-crystal-id"(s) of the element(s) to set the config for
 * @param {string} the "data-crystal" value you want to create validation for
 * @param {config} an object with the following params
 * @param {regex literal} [regex] Regex literal to test input value agains. You want this to match valid input
 * @param {input|blur} [trigger] Event that determines when fields are checked for validity. Defaults to "input".
 */
crystal.setCrystalFieldConfig("all", "name", {
    regex: /^(?!\s*$).+/,
});
```

Check out [these](https://github.com/cojomojo/Crystal.js/blob/master/validation-examples/common.js) awesome validation configurations for some common fields like name, email, and message. 

## Using the Event Emitter
The next thing you will want to do is decide what will happen if a user submits a form when fields are valid or invalid. Crystal.js proivdes an event emitter to make handling this easy. Check out this example (setup for this site's home page):

```js
crystal.ee.on("form-1-valid", function(el) {
    alert("Message Sent");
});
    
crystal.ee.on("form-1-invalid", function(el) {
    document.getElementById("not-valid").style.display = "block";
});
```

*Note that when a form's submit button is pressed, and a field is invalid, `preventDefault()`is applied.*

As you can see, each form emits it's own event. The events are dynamically named like so "form-(data-crystal-id)-valid" and "form-(data-crystal-id)-invalid".

## Going Further
Crystal.js can be very powerful. Check out the [GitHub Wiki](https://github.com/cojomojo/crystal.js/wiki) for the complete and in depth documentation.

## Contributing
The goal of Crystal.js is to be a boilerplate for awesome inline form validation. This should be kept in mind when contributing. Pull the dev branch, contribute, and submit a pull request!

## License
MIT
