"use strict";

var _ = require('lodash');
var React = require('react');
var dispatcher = require('../../../dispatchers/bots_dispatcher');

var Button = React.createClass({

  getStarted: function() {
    dispatcher.dispatch({
      actionType: 'loadBots',
      data: { some: 'payload' }
    }); 
  }, 

  componentDidMount: function() {
    this.props.collection.on('sync', function() {
      this.setState({ text: "collection fetched" });
    }.bind(this));
  },

  componentDidUnmount: function() {
    this.props.collection.off('sync');
  },

  getInitialState: function() {
    return {
      text: 'Get started now'
    }
  },

  render: function() {
    return (
      <button onClick={this.getStarted}>{this.state.text}</button>
    )
  }
});

var Bots = React.createClass({

  componentDidMount: function() {
    this.props.collection.on('sync', function() {
      this.forceUpdate();
    }.bind(this));
  },

  componentDidUnmount: function() {
    this.props.collection.off('sync');
  },

  render: function() {
    var botsList = _.map(this.props.collection.models, function(model) {
      return <li>{model.get('value')}</li>
    });
    
    return (
      <div>
        <h1>Here go the BOTS!!</h1>
        <Button collection={this.props.collection}/>
        <ul className='botsList'>
          {botsList}
        </ul>
      </div>
    )
  }
});

module.exports = Bots;

