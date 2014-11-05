var dispatcher = require('../dispatchers/admin-dispatcher');
var transactionActions = require('./config.json').actions;

var actions = {
  fetchSellQuote: function(opts) {
    dispatcher.handleEvent({
      actionType: transactionActions.fetchSellQuote,
      data: opts
    });
  },

  fetchBuyQuote: function(opts) {
    dispatcher.handleEvent({
      actionType: transactionActions.fetchBuyQuote,
      data: opts
    });
  },

  buy: function(opts) {
    dispatcher.handleEvent({
      actionType: transactionActions.buy,
      data: opts
    });
  },

  sell: function(opts) {
    dispatcher.handleEvent({
      actionType: transactionActions.sell,
      data: opts
    });
  }
};

module.exports = actions;

