'use strict';

/**
 * [Crystal constructor. This is object represents an entire form.]
 * @param {string} formID     [The ID of the form without the "#"]
 * @param {boolean} submitType [Will the form be submitted via ajax? If set to false, form will use standard submit.]
 */
function Crystal(formID, ajaxSubmit) {
	var crystalForm = {
		formID: formID,
		ajaxSubmit: ajaxSubmit,
		fields: [],	
		addField: function(regex, domOBJ) {
			var aField = new Field(regex, domOBJ);
			this.fields.push(aField);
		},
		inlineValidate: function () {
			for(var i = 0; i < this.fields.length; i++) {
				if(!this.fields[i].isValid() && this.fields[i].wasActive() > 0) {
						this.fields[i].domOBJ.className += ' invalid';
						this.fields[i].lastState = false;
				} 
				else {
						this.fields[i].domOBJ.className = this.fields[i].domOBJ.className.replace( /(?:^|\s)invalid(?!\S)/g , '')
						this.fields[i].lastState = true;
					}
			}
		},
		ajaxSubmitForm: function(formID) {
			// this will be bound to the form soon
			// so store it now
			var this_Crystal = this;
			document.getElementById(formID).addEventListener('submit',
				function(e) {
					var alertSuccess = document.querySelectorAll(".alert-success");
					var alertInvalid = document.querySelectorAll(".alert-invalid");
					var invalid = document.querySelectorAll(".invalid");
					var required = document.querySelectorAll(".required");

					e.preventDefault();

					var valid = true;
					for(var i = 0; i < this_Crystal.fields.length; i++) {
						if(this_Crystal.fields[i].lastState === false) {
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
		},
		standardSubmitForm: function(formID) {
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
	};

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

	this.isValid = function() {
		if (this.regex.test(this.domOBJ.value)) {
			return true;
		} else {
				return false;
			}
	};

  this.wasActive = function() {
		if(this.domOBJ == document.activeElement) {
			this.timesActive++;
			return this.timesActive;
		} else {
				return this.timesActive;
		}
	};
}
