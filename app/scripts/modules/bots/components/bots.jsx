"use strict";

var _ = require('lodash');
var React = require('react');

var Button = React.createClass({
  getStarted: function() {
    alert('Let\'s go!');
  }, 

  render: function() {
    return (
      <button onClick={this.getStarted}>Get started now</button>
    )
  }
});

var Bots = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Here go the BOTS!!</h1>
        <Button />
      </div>
    )
  }
});

module.exports = Bots;

