'use strict';

var crystal = new Object();

function crystalField(regex, domOBJ) {
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

// Checks if crystalField is valid. Returns true, if 
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
crystal.someName  = new crystalField( /[A-Za-z -']$/ , document.getElementById('crystal-someName'));

// A default object for email validation.
// Will validate all emails that adhere to the RFC2822 standard.
crystal.email = new crystalField( '' , document.getElementById('crystal-email'));
// Directly changing the value of email.regex
// becaues passing this huge beastas an param would be messy
crystal.email.regex = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;

// A default object for message validation.
// Will match everything but an empty message.
crystal.message  = new crystalField( /^(?!\s*$).+/ , document.getElementById('crystal-message'));

// A default object for a hidden spamecheck crystalField. 
// Returns false if crystalField is anything but empty.
crystal.spamcheck = new crystalField( /^(?!\s*$).+/ , document.getElementById('crystal-spamcheck'))
crystal.spamcheck = {
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

// Checks if crystalField is valid and adds the CSS
// classes used to show invalid crystal. Also changes lastState.
function inlineValidate(crystalField) {
	if(!crystalField.isValid() && crystalField.wasActive() > 0) {
			crystalField.domOBJ.className += ' invalid';
			crystalField.lastState = false;
		} 
	else {
			crystalField.domOBJ.className = crystalField.domOBJ.className.replace( /(?:^|\s)invalid(?!\S)/g , '')
			crystalField.lastState = true;
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
			for(var crystalField in crystal) {
				if(crystal[crystalField].lastState === false) {
					valid = false;
				} 
			}

			if(valid === true) {
				var form = serialize(document.getElementById(formID));

				var r = new XMLHttpRequest();
				r.open('POST', '/', true);
				r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
			
			for(var crystalField in crystal) {
				if(crystal[crystalField].lastState === false) {
					e.preventDefault();
					valid = false;
				} 
			}
		});
}





