"use strict";

var React = require('react');
var routes = require('./components/router.jsx');

var App = require('./components/app.jsx');

var app = new App();

React.renderComponent(app, document.getElementById('content-main'));
//React.renderComponent(routes, document.getElementById('content-main'));

