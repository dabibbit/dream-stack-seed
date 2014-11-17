"use strict";

var React = require('react');
var BotsView = require('../modules/bots/components/bots.jsx');
var Bots = require('../modules/bots/collections/bots');

var App = React.createClass({
  
  render: function() {
    return (
      <BotsView collection={new Bots()}/>
    )
  }
});

module.exports = App;

