'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var payments = require('../config.json');
var Model = require('../models/payment.js');
var session = require('../../../modules/session/models/session');
var appConfig = require('../../../shared/app-config');

Backbone.$ = $;

var Payments = Backbone.Collection.extend({

  model: Model,

  url: appConfig.baseUrl,

  comparator: function(a, b) {
    return b.id - a.id;
  },

  initialize: function() {
    _.bindAll(this);

    //register method with dispatcher
    adminDispatcher.register(this.dispatcherCallback);
  },

  dispatcherCallback: function(payload) {
    if (_.isUndefined(this[payload.actionType])) {
      return false;
    }

    this[payload.actionType](payload.data);
  },

  updateBaseUrl: function(newBaseUrl) {
    this.url = newBaseUrl;
  },

  urlObject: {
    "payments": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "incoming": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "completed": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "failed": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "outgoing": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "new": {
      "path":"/v1/ripple_transactions",
      "method": "get"
    },
    "flagAsDone": {
      "path":"/v1/ripple_transactions/",
      "method": "save"
    }
  },

  updateUrl: function(page) {
    var page = page.split('/')[2];

    if (!page || _.isUndefined(this.urlObject[page])) {
      console.warn("undefined route in url object");
      return false;
    }

    this.url += this.urlObject[page].path;
    this.httpMethod = this.urlObject[page].method;

    this.fetchRippleTransactions();
  },

  flagAsDone: function(id) {
    var model = this.get(id);

    this.url += this.urlObject.flagAsDone.path + id;
    model.save('state', 'completed', {
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', session.get('credentials'));
      }
    });
  },

  fetchRippleTransactions: function() {
    this.fetch({
      headers: {
        Authorization: session.get('credentials')
      }
    });
  },

  directionMap: {
    incoming: "from-ripple",
    outgoing: "to-ripple"
  },

  filterByDirection: function(direction) {
    var _this = this;

    var filtered = this.filter(function(payment) {
      return payment.get('direction') === _this.directionMap[direction];
    });

    return new Payments(filtered);
  },

  filterByState: function(state) {
    var _this = this;

    if (state === 'all') {
      return this;
    }

    var filtered = this.filter(function(payment) {
      return payment.get('state') === state;
    });

    return new Payments(filtered);
  },

  //create fixture. delete when db ready
  getFakeType: function(data) {
    var output;

    output = _.map(data.ripple_transactions, function(model) {
      return _.extend({direction: Math.round(Math.random()) ? "to-ripple" : "from-ripple"}, model);
    });

    return {ripple_transactions: output};
  },

  parse: function(data) {
    // add fixture. Remove when db is ready
    data = this.getFakeType(data);

    return data.ripple_transactions;
  },

  sendPaymentComplete: function(paymentData) {
    var paymentModel = new this.model(paymentData);
    // set up listener for sync - check status: succeeded/failed

    this.add(paymentModel);
    this.trigger("paymentAdded", this);

    paymentModel.pollStatus();
  }
});

module.exports = Payments;
