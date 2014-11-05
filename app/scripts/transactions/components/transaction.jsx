"use strict";

var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;

var Payment = React.createClass({

  handleClick: function(e) {
    e.preventDefault();

  },

  render: function() {
    return (
      <li onClick={this.handleClick}>
      {this.props.state}
      {this.props.amount}
      {this.props.quote_currency}
      {this.props.quote_amount}
      <button className="btn">Done</button></li>
    );
  }
});

module.exports = Payment;

