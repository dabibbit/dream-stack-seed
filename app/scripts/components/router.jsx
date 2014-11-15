"use strict";

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var NotFound = require('./not-found/not-found.jsx');

var Payments = require('../modules/payments/components/payments.jsx');
var LoginForm = require('../modules/session/components/login-form.jsx');
var Session = require('../modules/session/components/session.jsx');

var session = require('../modules/session/models/session');

// continuously fetch when tab is active
var paymentActions = require('../modules/payments/actions.js');
var heartbeats = require('heartbeats');
var pollingHeart = new heartbeats.Heart(5000);

var pollWhenActive = function() {
  if (session.isLoggedIn()) {
    paymentActions.fetchRippleTransactions();
  }
};

pollingHeart.onBeat(1, pollWhenActive);

window.onfocus = function() {
  pollingHeart.clearEvents();
  pollingHeart.onBeat(1, pollWhenActive);
};

window.onblur = function() {
  pollingHeart.clearEvents();
};

// needed for dev tools to work
window.React = React;

var App = require('./app.jsx');

var routes = (
  <Routes>
    <Route name="app" path="/" handler={App}>
      <DefaultRoute handler={Payments} path="payments/outgoing" />
      <Route name="login" handler={Session} />
      <Route name="logout" handler={Session} />
      <Route name="payments" path="payments/:filter" handler={Payments}/>
      <Route name="notFound" handler={NotFound} />
      <NotFoundRoute handler={NotFound} />
    </Route>
  </Routes>
);

module.exports = routes;

