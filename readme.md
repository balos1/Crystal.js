crystal.js
---
##### Version 0.1.0
##### See it in action at http://functioncreate.com

# A lightweight Javascript inline/live form validator
+ 3KB minified 
+ No Jquery.

# Easy use, Built-In Validation Functions
crystal.js has four of the most common fields covered with prebuilt functions.

+ Name (checks if name is not empty and without digits)
+ Email (checks if email adheres to the RFC2822 standard)
+ Message (check if empty)
+ Spam Check (if you use a hidden field to detect spammers, this detects if any input was received)

# Flexible
crystal.js is easily modifiable and easily extendable. See the section "crystal.js Objects and Functions", and "How to Extend crystal.js". 

# Getting started
1. Download or clone crystal.js
2. Include crystal.js and form-serialize at the bottom of your page.
        
```html       
<script type='text/javascript', src='http://form-serialize.googlecode.com/svn/trunk/serialize-0.2.min.js'</script>
<script type='text/javascript', src='/path/to/crystal.js'></script>
```
3. Right below the crystal.js include mentioned above, include this activation snippet

```html
<script type='text/javascript'>
        ajaxSubmitForm('FORM-ID') // If using ajax to submit form, leave this.
        standardSubmitForm('FORM-ID') // If standard form submit, leave this. 
</script>
```
4. For the pre-made, easy to use validators

+ For a **name field** add the ID `crystal-someName` to the `ID` attribute of the input element as well as the function call 
`inlineValidate(fields.someName)` to the `oninput` attribute. If the field is required, add the class `required`. 
+ For an **email field** add the ID `crystal-email` to the input element as well the function call
`inlineValidate(fields.email)` to the `oninput` attribute. If the field is required, add the class `required`.
+ For a **message field** add the ID `crystal-message` to the input element as well the function call
`inlineValidate(fields.message)` to the `oninput` attribute. If the field is required, add the class `required`.
+ For a **hidden spam-check field** add the ID `crystal-spamcheck` to the input element as well the function call 
`inlineValidate(fields.spamcheck)` to the `oninput` attribute. If the field is required, add the class `required`.
+ Here is an example:

    ```html
    <input type="text" id="crystal-someName" name="someName" oninput="inlineValidate(fields.someName)" class="required">
    ```
5. Add CSS to indicate when a field is invalid.
    
    ```css
    .invalid { border: 2px solid #f15b22 !important; }
    ```
6. **If desired**, add some sort of HTML element to alert a user that their input was invalid, or that a message was sent successfully when the submit button is clicked. crystal.js will show the success alert if the message is sent successfully and if you add the class 
`alert-success` to the element. It will also show the invalid alert if you add the class `alert-invalid` to the element. 
7. **Always** use server side validation as well!


# crystal.js Objects and Functions
If you are looking to extend crystal.js It is important to know how the `isValid` function in crystal.js works, as well as how the model for the `field` object looks. 

#### The `field` object
|    -----------------    **field**        -----------------    |
|---|
|domObj|
|regex|
|lastState|
|timesActive|
|isValid()|
|wasActive()|

#### The `isValid()` method
```Javascript
function isValid() {
    if (this.regex.test(this.domOBJ.value)) {
        return true;
    } else {
            return false;
        }
}
```
**Note** that `this.regex.test()` is true when the regex matches the string it is passed.


# How to Extend/Modify crystal.js
**crystal.js is easily extendable.**

In the "activation snippet" `<script></script>` , right below the include `<script></script>` tags, create a new `field` object. The `field` constructor takes two arguments, the first being either a regex variable, or the regex directly. The second argument to the constructor is the DOM object to be validated. Here is an example below:
        
```javascript
fields.fieldToBeValidated = new field( /^(?!\s*$).+/ , document.getElementById('crystal-fieldToBeValidated'));
```
        
It is **highly** recommended to follow the same naming convention as the built in crystal.js validator objects. I.e. the name of the object matches the suffix of the ID, which is prefixed with "crystal-".  


# Contributing
The goal of crystal.js is to be a lightweight boilerplate for simple inline form validation that is scalable. Thus, when contributing keep this in mind. No more than 5 total built in validators will be included, and there is currently 4. The focus of contributions should be fixing bugs as well as making crystal.js more efficient, and easier to use. Fork, and send a pull request. All contributors will be added to a list of contributors.

# License
MIT
