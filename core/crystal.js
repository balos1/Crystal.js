/*
 * Crystal.js
 * https://github.com/cojomojo/crystal.js
 *
 * Copyright (c) 2014 Cody Balos
 * Licensed under the MIT license.
 */

(function(window, document, undefined) { 'use strict';

	/**
	 * Crystal.js is a inline/live form validator boilerplate
	 * written in pure javascript. No jQuery.
	 * @param {config} config object takes the following
	 * @param {string} [formID] the form HTML ID without the '#'
	 * @param {boolean} [ajaxSubmit] will the form be submitted via ajax
	 */
	function Crystal(config) { 
		var init;

		this.defaults = {
			formID: "crystal-form",
			ajaxSubmit: false,
			// css: {},
			fields: {}	
		};

		this.config = Crystal.augment({}, this.defaults, config || {});

		// private
		init = (function() {
			var ajaxSubmitForm = this.ajaxSubmitForm.bind(this),
					standardSubmitForm = this.standardSubmitForm.bind(this);

			this.config.ajaxSubmit ? ajaxSubmitForm() : standardSubmitForm();
		}.bind(this))();
	}; // end Crystal


	Crystal.prototype = {
		
		/**
		 * Adds a field to the fields object.
		 * @type {config} See Field class for more details.
		 */
		addField: function(fieldConfig) {
			var aField = new Field(fieldConfig);
			this.config.fields[aField.config.commonName] = aField;
		},

		/**
		 * Take care of the styling
		 * @param  {boolean} [submitted] was the for succesfully submitted
		 */
		style: function(submitted) {
			var alertSuccess = document.querySelectorAll(".crystal-alert-success"),
					alertInvalid = document.querySelectorAll(".crystal-alert-invalid"),
					invalid = document.querySelectorAll(".crystal-invalid"),
					required = document.querySelectorAll(".crystal-required");

			if(submitted) {
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
		},		

		/**
		 * Allow for the form to submit via ajax
		 */
		ajaxSubmitForm: function() {
			document.getElementById(this.config.formID).addEventListener('submit',
				function(e) {
					var valid, form, xhr;
					// prevent submisison for now
					e.preventDefault();

					valid = true;

					for(var field in this.config.fields) {
						if(this.config.fields[field].config.lastState === false) {
							valid = false;
						} 
					}

					if(valid === true) {
						form = serialize(document.getElementById(this.config.formID));

						xhr = new XMLHttpRequest();
						xhr.open('POST', '/', true);
						xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
						xhr.onreadystatechange = function () {
							if(xhr.readyState != 4 ||  xhr.status != 200){
								return;
							}
							else {
								this.style(true);
							}
						}.bind(this);
						xhr.send(form);
					}
					else {
						this.style(false);
					}
				}.bind(this));
			},

		standardSubmitForm: function() {
			document.getElementById(this.config.formID).addEventListener('submit', 
				function(e) {
					var valid;
					// prevent submission for now
					e.preventDefault();

					valid = true;

					for(var field in this.config.fields) {
						if(this.config.fields[field].lastState === false) {
							valid = false;
						} 
					}
				}.bind(this));

				valid ? e.submit() : this.style(true);
		}

	} // end Crystal.prototype

	/**
	 * Field Class
	 * @param {config} [fieldConfig] config options for a field, takes params below
	 * @param {string} [fieldID] the field ID selector without the '#'
	 * @param {string} [commonName] human readable name
	 * @param {regex} [regex] Regex literal to test input value
	 * @param {oninput|onblur} [trigger] Event that determines when fields are checked for validity
	 */
	function Field(fieldConfig) {
		var init;

		this.defaults = {
			fieldID: "",
			domOBJ: null,
			commonName: this.fieldID,
			regex: null,
			lastState: false,
			timesActive: 0,
			trigger: "oninput"
		};

		this.config = Field.augment({}, this.defaults, fieldConfig || {});

		console.log(this.config)
		// make sure trigger option is legit
		if(this.config.trigger !== "oninput" && this.config.trigger !== "onblur") {
			this.config.trigger = this.defaults.trigger;
		}

		// private
		init = (function (trigger, ID){
			this.config.domOBJ = this.setDomOBJ(ID);

			this.config.domOBJ[trigger] = this.isValid.bind(this); 
		}.bind(this))(this.config.trigger, this.config.fieldID)

	} // end Field

	Field.prototype = {
		/**
		 * Sets the config variable domOBJ
		 * @param {string} [ID] the input elements ID without the '#'
		 * @return {DOM Obj} the DOM object represented by this field
		 */
		setDomOBJ: function(ID) {
			return document.getElementById(ID);
		},

		// /**
		//  * How many times the function was active
		//  * @return {int} how many time the element has been active
		//  */
		// wasActive: function() {
		// 	if(this.config.domOBJ == document.activeElement) {
		// 		this.config.timesActive++;
		// 		return this.config.timesActive;
		// 	} else {
		// 			return this.config.timesActive;
		// 	}
		// },

		/**
		 * Checks if the input is valid
		 * @return {Boolean} if the input is valid returns true, else it returns false
		 */
		isValid: function() {
			if (this.config.regex.test(this.config.domOBJ.value)) {
				this.config.domOBJ.className = this.config.domOBJ.className.replace( /(?:^|\s)crystal-invalid(?!\S)/g , '')
				this.config.lastState = true;
				return true;
			} else {
					this.config.domOBJ.className += " crystal-invalid";
					this.config.lastState = false;
					return false;
				}
		}
	} // end Field.prototype

  /**
   * augments the source object `augmented` by copying all of the properties from
   * the `source` object(s) to `augmented`. You can specify multiple `source` objects.
   * @function
   * @param {Object} [augmented] Destination object.
   * @param {...Object} [source] Source object(s).
   * @returns {Object} Reference to `augmented`.
   */
  function augment(augmented, source) {
    each(arguments, function(object) {
      if (object !== augmented) {
        each(object, function(value, key){
          augmented[key] = value;
        });
      }
    });
    return augmented;
  }
  Crystal.augment = augment;
  Field.augment = augment;

  /**
   * Iterate each element of an object. Useful for copying objects/arrays or comparing.
   * @function
   * @param {Array|Object} [object] object or an array to iterate
   * @param {Function} [callback] first argument is a value and second is a key.
   * @param {Object=} [context] Object to become context (`this`) for the iterator function.
   */
  function each(object, callback, context) {
  	var key;

    if (!object) {
      return ;
    }
 
    // Check to see if arg passed is an array
    if (typeof(object.length) !== "undefined") {
      for (key = 0; key < object.length; key++) {
        if (callback.call(context, object[key], key) === false) {
          return ;
        }
      }
    } else {
      for (key in object) {
        if (object.hasOwnProperty(key) && callback.call(context, object[key], key) === false) {
          return ;
        }
      }
    }
  }

	if (typeof module === "object" && module && typeof module.exports === "object") {
		
		// Expose Crystal for loaders that implement the node module pattern
		module.exports = Crystal;
	} else {
		window.Crystal = Crystal;

		// Register as a named AMD module
		if (typeof define === "function" && define.amd) {
      define( "crystal", [], function () { return Crystal; } );
    }
	}
})(window, document);

var crystal = new Crystal({
		formID: "contact-us",
    ajaxSubmit: true,
});
crystal.addField({
	fieldID: "crystal-someName",
	commonName: "name",
	regex: /[A-Za-z -']$/
})
crystal.addField({
	fieldID: "crystal-email",
	commonName: "email",
	regex: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/
})
crystal.addField({
	fieldID: "crystal-message",
	commonName: "message",
	regex: /^(?!\s*$).+/
})

