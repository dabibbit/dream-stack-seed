"use strict";

var React = require('react');
var routes = require('./components/router.jsx');
var Bots = require('./modules/bots/components/bots.jsx');

var bots = new Bots();

React.renderComponent(bots, document.getElementById('content-main'));
//React.renderComponent(routes, document.getElementById('content-main'));

