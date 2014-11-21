'use strict';

var fields = new Object();

function field(regex, domOBJ) {
	this.domOBJ = domOBJ; 
	this.regex  = regex;  
	this.lastState = false;
	this.timesActive = 0;   

  this.isValid = isValid;   
  this.wasActive = wasActive; 
}

function wasActive() {
	if(this.domOBJ == document.activeElement) {
		this.timesActive++;
		return this.timesActive
	} else {
			return this.timesActive;
	}
}

// Checks if field is valid. Returns true, if 
// it passes regex test, returns false if it fails. 
function isValid() {
	if (this.regex.test(this.domOBJ.value)) {
		return true;
	} else {
			return false;
		}
}

// A default object for name validation.
// Will match anything not blank or containing digits. 
fields.someName  = new field( /[A-Za-z -']$/ , document.getElementById('chivalry-someName'));

// A default object for email validation.
// Will validate all emails that adhere to the RFC2822 standard.
fields.email = new field( '' , document.getElementById('chivalry-email'));
// Directly changing the value of email.regex
// becaues passing this huge beastas an param would be messy
fields.email.regex = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;

// A default object for message validation.
// Will match everything but an empty message.
fields.message  = new field( /^(?!\s*$).+/ , document.getElementById('chivalry-message'));

// A default object for a hidden spamecheck field. 
// Returns false if field is anything but empty.
fields.spamcheck = new field( /^(?!\s*$).+/ , document.getElementById('chivalry-spamcheck'))
fields.spamcheck = {
	isValid: function() {
		if (!this.regex(this.domOBJ.value)) {
			return true;
		} else {
			return false;
		}
	},
	lastState: true,
	wasActive: function() {
		return 1;
	}
}

// Checks if field is valid and adds the CSS
// classes used to show invalid fields. Also changes lastState.
function inlineValidate(field) {
	if(!field.isValid() && field.wasActive() > 0) {
			field.domOBJ.className += ' invalid';
			field.lastState = false;
		} 
	else {
			field.domOBJ.className = field.domOBJ.className.replace( /(?:^|\s)invalid(?!\S)/g , '')
			field.lastState = true;
		}
}

function ajaxSubmitForm(formID) {
	document.getElementById(formID).addEventListener('submit',
		function(e) {
			var alertSuccess = document.querySelectorAll(".alert-success");
			var alertInvalid = document.querySelectorAll(".alert-invalid");
			var invalid = document.querySelectorAll(".invalid");
			var required = document.querySelectorAll(".required");

			e.preventDefault();

			var valid = true;
			for(var field in fields) {
				if(fields[field].lastState === false) {
					valid = false;
				} 
			}

			if(valid === true) {
				var form = serialize(document.getElementById(formID));

				var r = new XMLHttpRequest();
				r.open('POST', '/', true);
				r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				r.responseType = 'json';
				r.onreadystatechange = function () {
					if(r.readyState != 4 ||  r.status != 200){
						return;
					}
					else {
						for(var i = 0; i < invalid.length; i++){
							invalid[i].className.replace( /(?:^|\s)invalid(?!\S)/g , '');		
						}	
						for(var i = 0; i < alertInvalid.length; i++){
							alertInvalid[i].style.display = 'none';
						}
						for(var i = 0; i < alertSuccess.length; i++){
							alertSuccess[i].style.display = 'block';
						}
					}
				}
				r.send(form);
			}
			else {
				for(var i = 0; i < alertInvalid.length; i++){
					alertInvalid[i].style.display = 'block';
				}
				for(var i = 0; i < required.length; i++){
					required[i].className += " invalid";
				}
			}
	});
}

function standardSubmitForm(formID) {
	document.getElementById(formID).addEventListener('submit', 
		function(e) {
			var valid = true;
			
			for(var field in fields) {
				if(fields[field].lastState === false) {
					e.preventDefault();
					valid = false;
				} 
			}
		});
}





