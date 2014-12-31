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
	 * written in pure javascript. No jQuery. ALWAYS USE SERVER SIDE VALIDATION TOO!
	 * @param {el} The parent DOM element of all form elements that will be crystallized
	 */
	function Crystal(el) {
		var init;

		if(el === undefined){
			el = document;
		}

		this.rawForms = [].slice.call(el.getElementsByTagName('form'));
		this.crystallized = [];

		// private
		init = (function(){
			for(var i = 0; i < this.rawForms.length; i++){
				this.rawForms[i].dataset.crystalId = i+1;

				this.crystallized.push(new Form(this.rawForms[i], this.ee));
			}
		}.bind(this))();

	}

	Crystal.prototype = {
		ee: new EventEmitter(),
		/**
		 * Pops the last element of the rawForms array
		 */
		popForm: function() {
			this.rawForms.pop();
			this.crystallized.pop();
		},

		/**
		 * Removes the given element from the rawForms array
		 * @param  {integer} [id] the "data-crystal-id" of the element to be removed
		 */
		removeForm: function(id) {
			this.rawForms.splice(id-1, 1);
			this.crystallized.splice(id-1, 1);

			// reset the crystal data attribute
			for(var i = 0; i < this.rawForms.length; i++){
				this.rawForms[i].dataset.crystal = i+1;
			}
		},

		/**
		 * Adds the given element to the rawForms array
		 * @param {[type]} formEl [description]
		 */
		addForm: function(formEl) {
			this.rawForms.push(formEl);
			this.crystallized.push(new Form(formEl));
		},

		/**
		 * Returns a form
		 * @param  {integer} [id] the "data-crystal-id" of the element to get
		 * @return {Form} the form corresponding to the "data-crystal-id"
		 */
		getForm: function(id) {
			return this.crystallized[id];
		},

		/**
		 * Returns a field from a form
		 * @param  {integer} [id] the "data-crystal-id" of the element to get
		 * @param  {string} [attribute] the "data-crystal" value of th element
		 * @return {CrystalField} Reference to the field of the form
		 */
		getField: function(id, attribute) {
			return this.getForm(id).crystallizedFields[attribute];
		},

		/**
		 * Sets the configurable parts of the 
		 * @param {int | int array | "all"} [id] the "data-crystal-id"(s) of the element(s) to set the config for
		 * @param {string} the "data-crystal" value you want to create validation for
		 * @param {config} a config which can take the paramters of a CrystalField
		 */
		setFieldConfig: function(id, attribute, config) {
			if(typeof id == "number"){
				this.getField(id, attribute).config = CrystalField.augment({}, this.getField(id, attribute).defaults, config || {});
			} 
			else if(id == "all"){
				for(var i = 0; i < this.crystallized.length; i++) {
					this.crystallized[i].crystallizedFields[attribute].config = 
						CrystalField.augment({}, this.crystallized[i].crystallizedFields[attribute].defaults, config || {});
				}
			} else {
				for(var i = 0; i < id.length; i++) {
					console.log(this.getField(id[i], attribute).config);
					this.getField(id[i], attribute).config = 
						CrystalField.augment({}, this.getField(id[i], attribute).defaults, config || {});
				}
			}
		}
	} // End Crystal.prototype
	
	/**
	 * Form Class
	 * @param {DOM object} [formEl] raw form DOM object
	 * @param {config} config object takes the following
	 * @param {object} [rawFields] an object of DOM objects (input/textarea elements) to be used as "fields"
	 */
	function Form(formEl, ee) { 
		var init;

		this.rawFields = [].slice.call(formEl.querySelectorAll("input, textarea"));
		this.crystallizedFields = {};
		
		// this.defaults = {
		// 	// css: {},
		// };

		// this.config = Form.augment({}, this.defaults, config || {});

		// private
		init = (function() {
			for(var i = 0; i < this.rawFields.length; i++){
				if(this.rawFields[i].dataset.crystal != undefined){
					var identifier = this.rawFields[i].dataset.crystal;

					this.crystallizedFields[identifier] = new CrystalField(this.rawFields[i]);
				} else {
					this.rawFields.splice(i, 1);
				}
			}

			this.watch(formEl, ee);
		}.bind(this))();
	}; // end Form


	Form.prototype = {
		watch: function(formEl, ee) {
			formEl.addEventListener('submit', function(e){
				var allValid = true;

				for(var field in this.crystallizedFields){
					if(this.crystallizedFields[field].config.lastState == false){
						allValid = false;
					}
				}

				if(allValid){
					ee.emit('valid', formEl)
				} else {
					e.preventDefault();
					ee.emit('invalid', formEl)
				}
			}.bind(this));
		},
		/**
		 * Removes a field from the rawFields array
		 * @param  {id} [id] the array posistion of the field
		 */
		removeField: function(identifier) {
			for(var i = 0; i < this.rawFields.length; i++) {
				if(this.crystallizedFields[identifier].domOBJ === this.rawFields[i]){
					this.rawFields.splice(i, 1);
				}
			}
			delete this.crystallizedFields[identifier];
		},
		
		/**
		 * Adds the given DOM element to both rawFields and 
		 * @param {DOM object} [fieldEL] The field element 
		 */
		addField: function(fieldEL) {
			var identifier;

			if (fieldEL.dataset.crystal == undefined){
				console.log("Field element's \"data-crystal\" property must be defined.");
				return;
			} else {
				identifier = fieldEl.dataset.crystal;
			}
			
			this.rawFields.push(fieldEL);
			this.crystallized[identifier] = new CrystalField(fieldEL);
		}
	} // end Form.prototype

	/**
	 * CrystalField Class
	 * @param {DOM object} [fieldEl] raw "form field" DOM object
	 * @param {config} [fieldConfig] config options for a field, takes following params
	 * @param {string} [attribute] the fields "data-crystal" value
	 * @param {regex literal} [regex] Regex literal to test input value agains. You want this to match valid input
	 * @param {input|blur} [trigger] Event that determines when fields are checked for validity. Defaults to "input".
	 */
	function CrystalField(fieldEL, fieldConfig) {
		var init;

		this.defaults = {
			attribute: fieldEL.dataset.crystal,
			domOBJ: fieldEL,
			regex: /[\s\S]*/,
			lastState: false,
			timesActive: 0,
			trigger: "input"
		};

		this.config = CrystalField.augment({}, this.defaults, fieldConfig || {});

		// private
		init = (function (trigger, ID) {
			// make sure trigger option is legit
			if(this.config.trigger !== "input" && this.config.trigger !== "blur") {
				this.config.trigger = this.defaults.trigger;
			}

			this.config.domOBJ.addEventListener(this.config.trigger, function(){
				this.isValid();
			}.bind(this));	
		}.bind(this))();

	} // end CrystalField

	CrystalField.prototype = {
		/**
		 * How many times the function was active
		 * @return {int} how many time the element has been active
		 */
		wasActive: function() {
			if(this.config.domOBJ == document.activeElement) {
				this.config.timesActive++;
				return this.config.timesActive;
			} else {
					return this.config.timesActive;
			}
		},

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
	} // end CrystalField.prototype

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
	// Crystal.augment = augment;
	// Form.augment = augment;
	CrystalField.augment = augment;

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
	/**
	 * tiny-events thanks to Björn Brauer
	 * Copyright (c) 2014 Björn Brauer
	 * https://github.com/ZauberNerd/tiny-events
	 */
	function EventEmitter() {
	    this._listeners = {};
	}

	EventEmitter.prototype.on = function _on(type, listener) {
	    if (!Array.isArray(this._listeners[type])) {
	        this._listeners[type] = [];
	    }

	    if (this._listeners[type].indexOf(listener) === -1) {
	        this._listeners[type].push(listener);
	    }

	    return this;
	};

	EventEmitter.prototype.once = function _once(type, listener) {
	    var self = this;

	    function __once() {
	        for (var args = [], i = 0; i < arguments.length; i += 1) {
	            args[i] = arguments[i];
	        }

	        self.off(type, __once);
	        listener.apply(self, args);
	    }

	    __once.listener = listener;

	    return this.on(type, __once);
	};

	EventEmitter.prototype.off = function _off(type, listener) {
	    if (!Array.isArray(this._listeners[type])) {
	        return this;
	    }

	    if (typeof listener === 'undefined') {
	        this._listeners[type] = [];
	        return this;
	    }

	    var index = this._listeners[type].indexOf(listener);

	    if (index === -1) {
	        for (var i = 0; i < this._listeners[type].length; i += 1) {
	            if (this._listeners[type][i].listener === listener) {
	                index = i;
	                break;
	            }
	        }
	    }

	    this._listeners[type].splice(index, 1);
	    return this;
	};

	EventEmitter.prototype.emit = function _emit(type) {
	    if (!Array.isArray(this._listeners[type])) {
	        return this;
	    }

	    for (var args = [], i = 1; i < arguments.length; i += 1) {
	        args[i - 1] = arguments[i];
	    }

	    this._listeners[type].forEach(function __emit(listener) {
	        listener.apply(this, args);
	    }, this);

	    return this;
	};

	// Create module for loaders
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

