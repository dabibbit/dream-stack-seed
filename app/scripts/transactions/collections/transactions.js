'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var payments = require('../config.json');
var Transaction = require('../models/transaction.js');
var session = require('../../session/models/session');

Backbone.$ = $;

var Transactions = Backbone.Collection.extend({

  model: Transaction,

  baseUrl: "http://localhost:5000",

  initialize: function() {
    _.bindAll(this, 'dispatcherCallback');

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

  buy: function() {
    console.log('buy');
  },

  sell: function() {
    console.log('sell');
  },

  fetchBuyQuote: function() {
    console.log('fetch buy quote');
  },

  fetchSellQuote: function() {
    console.log('fetch sell quote');
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
    "/payments/new": {
      "path": "/v1/ripple_transactions/:id",
      "method": "post"
    }
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
  }
});

module.exports = Transactions;
