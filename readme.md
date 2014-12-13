crystal.js
---
##### Version 0.1.3
##### See it in action at http://functioncreate.com

# A lightweight Javascript inline/live form validator
+ 4KB minified 
+ No Jquery.

# For Easy, Pre-Set Usage
The file crystal-common.js implements crystal.js and provides validation for the the following:
    + Name (checks if name is not empty and without digits)
    + Email (checks if email adheres to the RFC2822 standard)
    + Message (check if empty)

1. Include crystal.js, crystal-common.js, and form-serialize.

    ```html       
    <script type='text/javascript', src='http://form-serialize.googlecode.com/svn/trunk/serialize-0.2.min.js'</script>
    <script type='text/javascript', src='/path/to/crystal.min.js'></script>
    <script type='text/javascript', src='/path/to/crystal-common.min.js'></script>
    ```

2. You will need to add the id `crystal-someName` to your name input element like so:

        ```html
        <input type="text" id="crystal-someName" name="someName"></input>
        ```

For an email field, set the input element's id to `crystal-email`. For a message field, set the input element's id to `crystal-message`. 

# For Developers
### Flexible and Extendable
crystal.js is easily modifiable and easily extendable. It is built in a modular pattern, and provides a `module.export` for script loaders implementing the node.js module patter, or a named AMD module. crystal.js is easily extendible without using a script loader as well. To define your own crystal object and fields, use the `Crystal` constructor and the `addField` method. Below is an example:

    ```javascript
    var crystal = new Crystal({
        formID: "contact-us",
        ajaxSubmit: true,
    });
    crystal.addField({
        fieldID: "crystal-someName",
        commonName: "name",
        regex: /[A-Za-z -']$/
    })
    ```

The full list of options is found below.

### Configuration Options
**`Crystal` Constructor Options**

Option | Type | Default | Description
------ | ---- | ------- | -----------
formID | string | "crystal-form" | The form id without the '#'
ajaxSubmit | boolean | false | Whether the form be submitted via ajax or not

**`addField` options**

Option | Type | Default | Description
------ | ---- | ------- | -----------
fieldID | string | "" | The input element's id without the '#'
commonName | string | fieldID | If a human readable name should be specified, set it here
regex | Regex literal | null | Regex literal pattern. Should match valid input.
trigger | string | "oninput" | The DOM event to trigger the `isValid` method.Accepts "oninput" or "onblur"

### Further Extension ###
If you are looking to extend crystal.js even further, you can do so via object prototypes. More on this coming soon.

# Contributing
The goal of crystal.js is to be a lightweight boilerplate for simple inline form validation. Thus, when contributing keep this in mind. Fork, and send a pull request. All contributors will be added to a list of contributors.

# License
MIT
