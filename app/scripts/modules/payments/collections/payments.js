'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var payments = require('../config.json');
var Model = require('../models/payment.js');
var session = require('../../../modules/session/models/session');

Backbone.$ = $;

var Payments = Backbone.Collection.extend({

  model: Model,

  baseUrl: "http://localhost:5000",

  initialize: function() {
    _.bindAll(this);

    //register method with dispatcher
    adminDispatcher.register(this.dispatcherCallback);
  },

  dispatcherCallback: function(payload) {
    console.log("payload", payload);
    if (_.isUndefined(this[payload.actionType])) {
      return false;
    }

    this[payload.actionType](payload.data);
  },

  urlObject: {
    "/payments": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "/payments/incoming": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "/payments/completed": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "/payments/failed": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "/payments/outgoing": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "/payments/new": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    // "/payments/new": {
    //   "path": "/v1/ripple_transactions/:id",
    //   "method": "post"
    // }
  },

  updateUrl: function(page) {
    if (!page || _.isUndefined(this.urlObject[page])) {
      return false;
    }

    this.url = this.baseUrl + this.urlObject[page].path;
    this.httpMethod = this.urlObject[page].method;

    this.fetchData();
  },

  fetchData: function() {
    console.log("fetch called");
    this.fetch({
      headers: {
        Authorization: session.get('credentials')
      }
    });
  },

  parse: function(data) {
    console.log(data);
    return data.ripple_transactions;
  },

  addNewSentPayment: function(payment) {
    console.log('# of models before', this.length);
    this.add(payment);
    console.log('# of models after', this.length);
  }
});

module.exports = Payments;
