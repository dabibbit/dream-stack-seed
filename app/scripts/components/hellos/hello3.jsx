var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var BootstrapButton = require('react-bootstrap').Button;
var Dispatcher = require('../../dispatchers/dispatcher');

var Hello = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    var newGreeting = e.target.getAttribute('data-greeting');

    if (newGreeting) {
      Dispatcher.dispatch({
        actionType: 'update',
        data: {greeting: newGreeting}
      });
    }
  },

  getInitialState: function() {
    return {
      greeting: this.props.model.get('greeting')
    };
  },

  updateGreeting: function() {
    this.setState({
      greeting: this.props.model.get('greeting')
    })
  },

  componentDidMount: function() {
    this.props.model.on('change', this.updateGreeting);
  },

  render: function() {
    return (
      <div className="row">
      <div className="col-xs-6 col-sm-4">
        <ButtonToolbar onClick={this.handleClick}>
          <BootstrapButton bsStyle="success" data-greeting="GRUNT">GRUNT</BootstrapButton>
          <BootstrapButton bsStyle="warning" data-greeting="GRRRAAAAAAARRRRGGG">GRRRAAAAAAARRRRGGG</BootstrapButton>
        </ButtonToolbar>
      </div>
      <p className="col-xs-6 col-sm-4">You Said {this.state.greeting}</p>
      </div>
    );
  }
});

module.exports = Hello;