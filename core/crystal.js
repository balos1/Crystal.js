/*
 * crystal.js
 * https://github.com/cojomojo/crystal.js
 *
 * Copyright (c) 2014 Cody Balos
 * Licensed under the MIT license.
 */

'use strict';

/**
 * [Crystal "constructor". This is object represents an entire form.]
 * @param {string} formID     [The ID of the form without the "#"]
 * @param {boolean} submitType [Will the form be submitted via ajax? If set to false, form will use standard submit.]
 */
function Crystal(formID, ajaxSubmit) {
	var crystalForm = {
		formID: formID,
		ajaxSubmit: ajaxSubmit,
		fields: {},	
		addField: function(regex, domOBJ, fieldName) {
			var aField = new Field(regex, domOBJ);
			this.fields[fieldName] = aField;
		},
		ajaxSubmitForm: function(formID) {
			// this will be bound to the form soon
			// so store it now
			var this_Crystal = this;

			document.getElementById(formID).addEventListener('submit',
				function(e) {
					// prevent submisison for now
					e.preventDefault();

					var valid = true;

					for(var field in this_Crystal.fields) {
						console.log(this_Crystal.fields[field]['lastState']);
						if(this_Crystal.fields[field]['lastState'] === false) {
							valid = false;
						} 
					}

					if(valid === true) {
						console.log("All is valid!")
						var form = serialize(document.getElementById(formID));

						var r = new XMLHttpRequest();
						r.open('POST', '/', true);
						r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
						r.onreadystatechange = function () {
							if(r.readyState != 4 ||  r.status != 200){
								return;
							}
							else {
								this_Crystal.style(true);
							}
						}
						r.send(form);
					}
					else {
						this_Crystal.style(false);
					}
				});
		},
		standardSubmitForm: function(formID) {
			// this will be bound to the form soon
			// so store it now
			var this_Crystal = this;

			document.getElementById(formID).addEventListener('submit', 
				function(e) {
					var valid = true;

					for(var field in this_Crystal.fields) {
						console.log(this_Crystal.fields[field]['lastState']);
						if(this_Crystal.fields[field]['lastState'] === false) {
							valid = false;
						} 
					}
				});
		},
		style: function(valid) {
			var alertSuccess = document.querySelectorAll(".crystal-alert-success");
			var alertInvalid = document.querySelectorAll(".crystal-alert-invalid");
			var invalid = document.querySelectorAll(".crystal-invalid");
			var required = document.querySelectorAll(".crystal-required");

			if(valid) {
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
			else {
				for(var i = 0; i < alertInvalid.length; i++) {
					alertInvalid[i].style.display = 'block';
				}
				for(var i = 0; i < required.length; i++) {
					required[i].className += " crystal-invalid";					
				}
			}
		}		
	}; // end crystalForm

	if(ajaxSubmit) {
		crystalForm.ajaxSubmitForm(formID);
	}

	return crystalForm;
}

/**
 * [Field constuctor. Represents a field of a form]
 * @param {regex literal} regex  [Regular expression to match the field value to.]
 * @param {object} domOBJ [Object of the DOM]
 */
function Field(regex, domOBJ) {
	this.domOBJ = domOBJ; 
	this.regex = regex;
	this.lastState = false;
	this.timesActive = 0;

  this.wasActive = function() {
		if(this.domOBJ == document.activeElement) {
			this.timesActive++;
			return this.timesActive;
		} else {
				return this.timesActive;
		}
	};

	this.isValid = function() {
		if (this.regex.test(this.domOBJ.value)) {
			this.domOBJ.className = this.domOBJ.className.replace( /(?:^|\s)crystal-invalid(?!\S)/g , '')
			this.lastState = true;
			return true;
		} else {
				this.domOBJ.className += ' crystal-invalid';
				this.lastState = false;
				return false;
			}
	};
}
