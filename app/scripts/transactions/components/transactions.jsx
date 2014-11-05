"use strict";

var _ = require('lodash');
var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;
var TransactionActions = require('../actions.js');
var CurrentPath = require('react-router').CurrentPath;
var url = require('url');
var moment = require('moment');

var TransactionHeader = require('./transaction-header.jsx');
var TransactionItem = require('./transaction.jsx');

var Collection = require('../collections/transactions.js');
var collection = new Collection([
  {
    type: 'buy', 
    amount: 2,
    quote_amount: 2500,
    quote_currency: 'USD', 
    state: 'paid'
  }, {
    type: 'sell', 
    amount: 1,
    quote_amount: 1250,
    quote_currency: 'USD', 
    state: 'quote'
  }
]);

var Transactions = React.createClass({
  mixins: [CurrentPath],

  getInitialState: function() {
    return { transactions: []};
  },

  componentDidMount: function() {
    collection.on("sync", this.handleCollectionChange);
  },

  handleCollectionChange: function(collection) {
    if (this.isMounted()) {
      this.setState({
        transactions: collection
      });
    }
  },

  componentWillUnmount: function() {
    collection.off("change");
  },

  handleClick: function(e) {
    TransactionActions.buy(e.id);
  },

  render: function() {

    console.log("render called");

    var transactionItems = this.state.transactions.map(function(model) {
      var id = model.get('id');

      return (
          <TransactionItem
            key={id}
            state={model.get('state')}
            amount={model.get('amount')}
            quote_amount={model.get("quote_amount")}
            quote_currency={model.get("quote_currency")}
            type={model.get("type")}
            onClick={this.handleClick.bind(this, "foo")}
          />);
    }, this);

    return (
      <div>
        <TransactionHeader />
        <h1>Transactions here</h1>
        <ul>
        {transactionItems}
        </ul>
      </div>
    );
  }
});

module.exports = Transactions;
