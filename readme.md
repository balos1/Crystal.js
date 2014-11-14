Chivalry.js
---
##### Version 0.0.1
##### See it in action at http://functioncreate.com

# A lightweight Javascript inline/live form validator
+ 2KB minified 
+ Jquery only needed for ajax form validation option.

# Easy use, Built-In Validation Functions
Chivalry.js has four of the most common fields covered with prebuilt functions.
+ Name (checks if name is not empty and without digits)
+ Email (checks if email adheres to the RFC2822 standard)
+ Message (check if empty)
+ Spam Check (if you use a hidden field to detect spammers, this detects if any input was received)

# Flexible
Chivalry.js is easily modifiable and easily extendable. See the section "Chivalry.js Objects and Functions", and "How to Extend Chivalry.js". 

# Getting started
1. Download or clone Chivalry.js
2. Include Chivalry.js at the bottom of your page.
        <script type='text/javascript', src='/path/to/Chivalry.js'></script>
3. Right below the Chivalry.js include mentioned above, include this activation snippet
        <script type='text/javascript'>
            ajaxSubmitForm('#FORM-ID') // If using ajax to submit form, leave this.
            standardSubmitForm('FORM-ID') // If standard form submit, leave this.
        </script>
4. For the pre-made, easy to use validators
    + For a **name field** add the ID `chivalry-someName` to the `ID` attribute of the input element as well     as the function call `inlineValidate(fields.someName)` to the `oninput` attribute. If the field is       required, add the class `required`.
    
    + For an **email field** add the ID `chivalry-email` to the input element as well the function call
    `inlineValidate(fields.email)` to the `oninput` attribute. If the field is required, add the class       `required`.

    + For a **message field** add the ID `chivalry-message` to the input element as well the function call
    `inlineValidate(fields.message)` to the `oninput` attribute. If the field is     required, add the       class `required`.

    + For a **hidden spam-check field** add the ID `chivalry-spamcheck` to the input element as well the        function call `inlineValidate(fields.spamcheck)` to the `oninput` attribute. If the field is                    required, add the class `required`.
    
    + Here is an example:
    `<input type="text" id="chivalry-someName" name="someName" oninput="inlineValidate(fields.someName)" class="required">`
5. Add CSS to indicate when a field is invalid. 
    `.invalid { border: 2px solid #f15b22 !important; }`
6. **If desired**, add some sort of HTML element to alert a user that their input was invalid, or that a message was sent successfully when the submit button is clicked. Chivalry.js will show the success alert if the message is sent successfully and if you add the class `alert-success` to the element. It will also show the invalid alert if you add the class `alert-invalid` to the element. 
7. **Always** use server side validation as well!


# Chivalry.js Objects and Functions
If you are looking to extend Chivalry.js It is important to know how the `isValid` function in Chivalry.js works, as well as how the model for the `field` object looks. 

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


# How to Extend/Modify Chivalry.js
**Chivalry.js is easily extendable.**

In the "activation snippet" `<script></script>` , right below the include `<script></script>` tags, create a new `field` object. The `field` constructor takes two arguments, the first being either a regex variable, or the regex directly. The second argument to the constructor is the DOM object to be validated. Here is an example below:
        
        fields.fieldToBeValidated = new field( /^(?!\s*$).+/ , document.getElementById('chivalry-fieldToBeValidated'));
        
It is **highly** recommended to follow the same naming convention as the built in Chivalry.js validator objects. I.e. the name of the object matches the suffix of the ID, which is prefixed with "chivalry-".  


# Contributing
The goal of Chivalry.js is to be a lightweight boilerplate for simple inline form validation that is scalable. Thus, when contributing keep this in mind. No more than 5 total built in validators will be included, and there is currently 4. The focus of contributions should be fixing bugs as well as making Chivalry.js more efficient, and easier to use. Fork, and send a pull request. All contributors will be added to a list of contributors.

# License
MIT
