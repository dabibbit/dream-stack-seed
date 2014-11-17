"use strict";

var _ = require('lodash');
var React = require('react');
var DocumentTitle = require('react-document-title');
var Button = require('react-bootstrap').Button;
var PaymentActions = require('../actions.js');
var CurrentPath = require('react-router').CurrentPath;
var ActiveState = require('react-router').ActiveState;
var Link = require('react-router').Link;
var url = require('url');
var moment = require('moment');
var numeral = require('numeral');
var NavSecondary = require('../../../components/nav-secondary.jsx');

var PaymentItem = require('./payment.jsx');

var Collection = require('../collections/payments.js');
var collection = new Collection();

var Model = require('../models/payment-create.js');
var model = new Model();

var PaymentCreateForm = require('./payment-create.jsx');

var Payments = React.createClass({
  mixins: [CurrentPath, ActiveState],

  formSymbolMap: {
    true: '-',
    false: '+'
  },

  getStateFromStore: function(props) {
    props = props || this.props;

    return {
      payments: collection,
      showForm: false,
      toggledSymbol: this.formSymbolMap[false]
    };
  },

  getInitialState: function() {
    return this.getStateFromStore();
  },

  componentDidMount: function() {
    collection.on('sync paymentAdded', this.handleCollectionSync);
    PaymentActions.updateUrl(this.getCurrentPath());
  },

  componentWillUnmount: function() {
    collection.off('sync');
    collection.off('change');
  },

  handleCollectionSync: function(collection) {
    console.log("sync", arguments);
    this.setState({
      payments: collection
    });
  },

  handleClick: function(id) {
    PaymentActions.flagAsDone(id);
  },

  toggleForm: function() {
    var newShowFormState = !this.state.showForm;

    this.setState({
      showForm: newShowFormState
    });

    this.setState({
      toggledSymbol: this.formSymbolMap[newShowFormState]
    });
  },

  closeForm: function() {
    this.setState({
      showForm: false,
      toggledSymbol: this.formSymbolMap[false]
    });
  },

  createTitle: function(direction) {
    direction = direction || 'incoming';

    var titleMap = {
      incoming: 'Received Payments',
      outgoing: 'Sent Payments'
    };

    return titleMap[direction];
  },

  render: function() {

    console.log("render");

    var direction = this.props.params.direction,
        state = this.props.params.state,
        tertiaryNav;

    // less than ideal, will refactor when we have pagination, if not sooner.
    // We could keep different collections for each type, but it depends on use case.
    var paymentItems = this.state.payments
        .filterByDirection(direction)
        .filterByState(state)
        .map(function(model) {
      var id = model.get('id'),
          currency = model.get('from_currency');
          // console.log("=======", model.attributes);

      // fromAddress is missing from /v1/payments/outgoing response, so sending a payment breaks app :(
      return (
          <PaymentItem
            key={id}
            id={id}
            direction={model.get('direction')}
            timeStamp={moment(model.get('createdAt')).format('MMM D, YYYY HH:mm z')}
            fromAddress={model.get('fromAddress').address}
            toAddress={model.get('toAddress').address}
            currency={currency}
            state={model.get('state')}
            amount={model.get('from_amount')}
            clickHandler={this.handleClick}
          />);
    }, this);

    //todo make separate component with iterator. Oy.
    if (direction === 'incoming') {
      tertiaryNav = (
        <div className="nav-tertiary">
          <Link to='payments' params={{direction: 'incoming', state: 'all'}}>All</Link>
          <Link to='payments' params={{direction: 'incoming', state: 'incoming'}}>Queued</Link>
          <Link to='payments' params={{direction: 'incoming', state: 'completed'}}>Completed</Link>
        </div>);
    } else {
      tertiaryNav = (
        <div className="nav-tertiary">
          <Link to='payments' params={{direction: 'outgoing', state: 'all'}}>All</Link>
          <Link to='payments' params={{direction: 'outgoing', state: 'outgoing'}}>Queued</Link>
          <Link to='payments' params={{direction: 'outgoing', state: 'pending'}}>Pending</Link>
          <Link to='payments' params={{direction: 'outgoing', state: 'completed'}}>Completed</Link>
          <Link to='payments' params={{direction: 'outgoing', state: 'failed'}}>Failed</Link>
        </div>);
    }

    return (
      <DocumentTitle title={this.createTitle(direction)}>
      <div>
        <div className="row">
          {this.state.showForm ? <PaymentCreateForm model={model} onSubmitSuccess={this.closeForm} /> : null}
          <div className="col-sm-4 col-xs-4">
            <h1>Payments:
              <span className='header-links'>
                <Link to='payments' params={{direction: 'outgoing', state: 'all'}}>
                  Sent
                </Link>
                <Link to='payments' params={{direction: 'incoming', state: 'all'}}>
                  Received
                </Link>
              </span>
            </h1>
          </div>
          <Button className="pull-right" onClick={this.toggleForm}>{this.state.toggledSymbol}</Button>
        </div>
        <div className='row'>
          <div className="col-xs-12">
            {tertiaryNav}
          </div>
        </div>
        <div className="row">
          <ul className="list-group">
          {paymentItems}
          </ul>
        </div>
      </div>
      </DocumentTitle>
    );
  }
});

module.exports = Payments;
