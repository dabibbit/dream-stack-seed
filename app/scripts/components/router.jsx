"use strict";

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var NotFound = require('./not-found/not-found.jsx');

var Transactions = require('../transactions/components/transactions.jsx');
var LoginForm = require('../session/components/login-form.jsx');
var Session = require('../session/components/session.jsx');

// needed for dev tools to work
window.React = React;

var App = require('./app.jsx');

var routes = (
  <Routes>
    <Route name="app" path="/" handler={App}>
      <DefaultRoute handler={Transactions} />
      <Route name="login" handler={Session} />
      <Route name="logout" handler={Session} />
      <Route name="payments" handler={Transactions}>
        <Route name="incoming" path="incoming" handler={Transactions} />
        <Route name="outgoing" path="outgoing" handler={Transactions} />
        <Route name="completed" path="completed" handler={Transactions} />
        <Route name="failed" path="failed" handler={Transactions} />
        <Route name="new" path="new" handler={Transactions} />
      </Route>
      <Route name="notFound" handler={NotFound} />
      <NotFoundRoute handler={NotFound} />
    </Route>
  </Routes>
);

module.exports = routes;

