/*
 * Crystal.js
 * https://github.com/cojomojo/crystal.js
 *
 * Copyright (c) 2015 Cody Balos
 * Licensed under the MIT license.
 */

(function(window, document, undefined) { 'use strict';

	/**
	 * Crystal.js is a inline/live form validator boilerplate
	 * written in pure javascript. No jQuery. ALWAYS USE SERVER SIDE VALIDATION TOO!
	 * @param {Boolean} [devMode] NOT YET SUPOPRTED
	 * @param {HTML Element} The parent DOM element of all form elements that will be crystallized
	 */
	function Crystal(devMode, el) {
		// if(devMode)  crystalTest();

		el = (typeof el === "undefined") ? document : el;

		this.rawCrystalForms = [].slice.call(el.getElementsByTagName('form'));
		this.crystallized = [];

		this.init = function() {
			for(var i = 0; i < this.rawCrystalForms.length; i++) {
				this.rawCrystalForms[i].dataset.crystalId = i+1;

				this.crystallized.push(new CrystalForm(this.rawCrystalForms[i]));
			}
		};

		this.init();
	}

	Crystal.prototype = {
		ee: new EventEmitter(),

		/**
		 * Pops the last element of the rawCrystalForms array
		 */
		popCrystalForm: function() {
			var last = this.crystallized.length - 1;

			this.crystallized[last].selfDestruct();

			this.rawCrystalForms.pop();
			this.crystallized.pop();
		},

		/**
		 * TODO: Add support for passing an array of id's to be removed
		 * 
		 * Removes the given element from the rawCrystalForms and crystallized array
		 * @param  {integer} [id] the "data-crystal-id" of the element to be removed
		 */
		removeCrystalForm: function(id) {
			this.rawCrystalForms[id-1].removeAttribute("data-crystal-id");

			this.crystallized[id-1].selfDestruct();

			this.rawCrystalForms.splice(id-1, 1);
			this.crystallized.splice(id-1, 1);

			// reset the crystal data attribute
			for(var i = 0; i < this.rawCrystalForms.length; i++) {
				this.rawCrystalForms[i].dataset.crystalId = i+1;
			}
		},

		/**
		 * Adds the given element to the rawCrystalForms array
		 * @param {HTML Element} [formEl] The raw html element to add
		 */
		addCrystalForm: function(formEl) {
			var last;

			this.rawCrystalForms.push(formEl);
			last = this.rawCrystalForms.length - 1;

			this.crystallized.push(new CrystalForm(this.rawCrystalForms[last]));

			// reset the crystal data attribute
			for(var i = 0; i < this.rawCrystalForms.length; i++) {
				this.rawCrystalForms[i].dataset.crystalId = i+1;
			}
		},

		/**
		 * TODO: Add support for passing an array of id's to be retrieved and returned
		 * 
		 * Returns a form
		 * @param  {integer} [id] the "data-crystal-id" of the element to get
		 * @return {CrystalForm} the form corresponding to the "data-crystal-id"
		 */
		getCrystalForm: function(id) {
			return this.crystallized[id-1];
		},
		
		/**
		 * TODO: Add support for passing an array of id's and attributes to be removed
		 * 
		 * Removes a field from the rawFields array
		 * @param  {integer} [id] the "data-crystal-id" of the element to get
		 * @param  {string} [attribute] the "data-crystal" value of th element
		 */
		removeCrystalField: function(id, attribute) {
			this.getCrystalForm(id).removeField(attribute);
		},

		/**s
		 * Adds the given DOM element to both rawFields and 
		 * @param {DOM object} [fieldEl] The field element 
		 */
		addCrystalField: function(id, fieldEl) {
			this.getCrystalForm(id).addField(fieldEl);
		},

		/**
		 * TODO: Add support for passing an array of id's to be retrieved and returned
		 * 
		 * Returns a field from a form
		 * @param  {integer} [id] the "data-crystal-id" of the element to get
		 * @param  {string} [attribute] the "data-crystal" value of th element
		 * @return {CrystalField} Reference to the field of the form
		 */
		getCrystalField: function(id, attribute) {
			return this.getCrystalForm(id).crystallizedFields[attribute];
		},

		/**
		 * Sets the configurable parts of the CrystalField
		 * @param {int | int array | "all"} [id] the "data-crystal-id"(s) of the element(s) to set the config for
		 * @param {string} the "data-crystal" value you want to create validation for
		 * @param {config} a config which can take the paramters of a CrystalField
		 */
		setCrystalFieldConfig: function(id, attribute, config) {
			if(typeof id == "number") {
				this.getCrystalField(id, attribute).config = 
					CrystalField.augment({}, this.getCrystalField(id, attribute).defaults, config || {});
				this.getCrystalField(id, attribute).init();
			} 
			else if(id == "all") {
				for(var i = 0; i < this.crystallized.length; i++) {
					this.crystallized[i].crystallizedFields[attribute].config = 
						CrystalField.augment({}, this.crystallized[i].crystallizedFields[attribute].defaults, config || {});
					this.crystallized[i].crystallizedFields[attribute].init();
				}
			} else {
				for(var i = 0; i < id.length; i++) {
					this.getCrystalField(id[i], attribute).config = 
						CrystalField.augment({}, this.getCrystalField(id[i], attribute).defaults, config || {});
					this.getCrystalField(id[i], attribute).init();
				}
			}
		},

		/**
		 * Properly destroys Crystal. Removes event listeners and etc.
		 */
		selfDestruct: function() {
			while(this.crystallized.length > 0) {
				this.popCrystalForm();
			}
		}
	} // End Crystal.prototype
	
	/**
	 * CrystalForm Class
	 * @param {DOM object} [formEl] raw form DOM object
	 * @param {config} config object takes the following
	 * @param {object} [rawFields] an object of DOM objects (input/textarea elements) to be used as "fields"
	 */
	function CrystalForm(formEl) { 
		this.rawSelf = formEl;
		this.rawFields = [].slice.call(this.rawSelf.querySelectorAll("input, textarea"));
		this.crystallizedFields = {};

		this.init = function() {
			for(var i = 0; i < this.rawFields.length; i++) {
				if(this.rawFields[i].dataset.crystal != undefined) {
					var attribute = this.rawFields[i].dataset.crystal;

					this.crystallizedFields[attribute] = new CrystalField(this.rawFields[i]);
				} else {
					this.rawFields.splice(i, 1);
				}
			}

			this.rawSelf.addEventListener('submit', this, false);
		};

		this.init();
	}; // end CrystalForm


	CrystalForm.prototype = {
		ee: Crystal.prototype.ee,

		handleEvent: function(e) {
			var allValid = true;

			for(var field in this.crystallizedFields) {
				if(this.crystallizedFields.hasOwnProperty(field)) {
					if(this.crystallizedFields[field].config.lastState == false) {
						allValid = false;
					}
				}
			}

			if(allValid) {
				this.ee.emit("form-" + this.rawSelf.dataset.crystalId + '-valid', this.rawSelf)
			} else {
				e.preventDefault();
				this.ee.emit("form-" + this.rawSelf.dataset.crystalId + '-invalid', this.rawSelf)
				}
		},

		/**
		 * Removes a field from the rawFields array
		 * @param  {id} [id] the array posistion of the field
		 */
		removeField: function(attribute) {
			this.crystallizedFields[attribute].selfDestruct();

			for(var i = 0; i < this.rawFields.length; i++) {
				if(this.crystallizedFields[attribute].domOBJ === this.rawFields[i]) {
					this.rawFields.splice(i, 1);
				}
			}

			delete this.crystallizedFields[attribute];
		},
		
		/**
		 * Adds the given DOM element to both rawFields and 
		 * @param {DOM object} [fieldEl] The field element 
		 */
		addField: function(fieldEl) {
			var attribute;

			if (fieldEl.dataset.crystal == undefined) {
				console.log("Field element's \"data-crystal\" property must be defined.");
				return;
			} else {
				attribute = fieldEl.dataset.crystal;
			}
			
			this.rawFields.push(fieldEl);
			this.crystallizedFields[attribute] = new CrystalField(fieldEl);
		},

		/**
		 * Properly destorys a CrystalForm
		 */
		selfDestruct: function() {
			this.rawSelf.removeEventListener('submit', this, false);

			for(var field in this.crystallizedFields){
				if(this.crystallizedFields.hasOwnProperty(field)) {
					this.crystallizedFields[field].selfDestruct();
				}
			}
		}
	} // end CrystalForm.prototype

	/**
	 * CrystalField Class
	 * @param {DOM object} [fieldEl] raw "form field" DOM object
	 * @param {config} [fieldConfig] config options for a field, takes following params
	 * @param {string} [attribute] the fields "data-crystal" value
	 * @param {regex literal} [regex] Regex literal to test input value agains. You want this to match valid input
	 * @param {input|blur} [trigger] Event that determines when fields are checked for validity. Defaults to "input".
	 */
	function CrystalField(fieldEl, fieldConfig) {
		var attached = false;

		this.defaults = {
			attribute: fieldEl.dataset.crystal,
			domOBJ: fieldEl,
			regex: /[\s\S]*/,
			lastState: false,
			timesActive: 0,
			trigger: "input"
		};

		this.config = CrystalField.augment({}, this.defaults, fieldConfig || {});

		this.init = function () {
			// make sure trigger option is legit
			if(this.config.trigger !== "input" && this.config.trigger !== "blur") {
				this.config.trigger = this.defaults.trigger;
			}

			this.active();

			if(attached) this.config.domOBJ.removeEventListener(this.defaults.trigger, this, false);
			this.config.domOBJ.addEventListener(this.config.trigger, this, false);
			attached = true;
		};

		this.init();
	} // end CrystalField

	CrystalField.prototype = {
		/**
		 * Checks if the input is valid
		 * @return {Boolean} if the input is valid returns true, else it returns false
		 */
		handleEvent: function(event) {
			if (this.config.regex.test(this.config.domOBJ.value)) {
				this.config.domOBJ.className = this.config.domOBJ.className.replace( /(?:^|\s)crystal-invalid(?!\S)/g , '')
				this.config.lastState = true;
				return true;
			} else {
					this.config.domOBJ.className += " crystal-invalid";
					this.config.lastState = false;
					return false;
				}
		},

		/**
		 * How many times the function was active
		 * @return {int} how many time the element has been active
		 */
		active: function() {
			if(this.config.domOBJ == document.activeElement){
				this.config.timesActive++;
			}
			return this.config.timesActive;
		},

		/**
		 * Properly destroys a CrystalField
		 */
		selfDestruct: function() {
			this.config.domOBJ.removeEventListener(this.config.trigger, this, false);
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
			each(object, function(value, key) {
			  augmented[key] = value;
			});
		  }
		});
		return augmented;
	}
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