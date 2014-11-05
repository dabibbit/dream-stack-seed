'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var dispatcher = require('../../dispatchers/admin-dispatcher');
var config = require('../config.json');
Backbone.$ = $;

var Transaction = Backbone.Model.extend({
  defaults: {
    type: '',
    amount: 0,
    quote_amount: 0.0,
    quote_currency: '',
    state: ''
  },

  requiredAttrs: {
    type: {
      type: 'string' // [buy, sell]
    },
    amount: {
      type: 'number' // decimal
    },
    quote_amount: {
      type: 'number' // decimal
    },
    quote_currency: {
      type: 'string',
      minLength: 1
    },
    state: {
      type: 'string'
    }
  },

  initialize: function() {
    _.bindAll(this, 'testValid', 'validate');

    dispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {
      login: this.login
    };

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  validationErrors: [],

  handleObject: function(attr, minLength) {
    if (attr === null) {
      return false;
    }

    if (Array.isArray(attr)) {
      return attr.length >= minLength;
    }

    return Object.keys(attr).length >= minLength;
  },

  handleString: function(attr, minLength) {
    return !!attr && attr.length >= minLength;
  },

  testValid: function(attr, requirements) {
    var attribute = this.get(attr);
    var testValid = {
      object: this.handleObject,
      string: this.handleString,
    };
    var isDefined = !_.isUndefined(attribute);
    var type = requirements.type === 'array' ? 'object' : requirements.type;
    var isValid = typeof attribute === type;

    if (isValid && !_.isUndefined(testValid[typeof attribute])) {
      isValid = testValid[typeof attribute](attribute, requirements.minLength);
    }

    // custom error messaging
    if (!isDefined) {
      this.validationErrors.push('"' + attr + '" of payment is undefined');
    } else if (!isValid) {
      this.validationErrors.push('"' + attr + '" of payment is invalid');
    }

    //return isDefined && isValid;
  },

  validate: function() {
    var isValid = true,
        _this = this;

    _.each(this.requiredAttrs, function(requirements, requiredAttr) {
      if (!_this.testValid(requiredAttr, requirements)) {
        isValid = false;
      }
    });

    if (!isValid) {
      return 'There is an error';
    }
  }
});

module.exports = Transaction;

