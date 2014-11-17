var Backbone = require('backbone');
var jquery = require('jquery');
var Bot = require('../models/bot');
var _ = require('lodash');
var dispatcher = require('../../../dispatchers/bots_dispatcher');

Backbone.$ = jquery;

var Bots = Backbone.Collection.extend({
  model: Bot,

  initialize: function() {
    _.bindAll(this);
    dispatcher.register(this.dispatchCallback);
  },

  url: function() {
    return 'https://api.ripple.com/v1/accounts/r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk/balances';
  },
  
  parse: function(response) {
    return response.balances;
  },

  dispatchCallback: function(payload) {
    var _this = this;
    switch (payload.actionType) {
      case 'loadBots':
        _this.loadBots(payload.data);
        break;
    }
  },

  loadBots: function(payloadData) {
    this.fetch();
  }
});

module.exports = Bots;

