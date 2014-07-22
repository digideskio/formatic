'use strict';

var React = require('react/addons');
var R = React.DOM;

var hasAncestor = function (child, parent) {
  if (child.parentNode === parent) {
    return true;
  }
  if (child.parentNode === child.parentNode) {
    return false;
  }
  if (child.parentNode === null) {
    return false;
  }
  return hasAncestor(child.parentNode, parent);
};

var isOutside = function (nodeOut, nodeIn) {
  if (nodeOut === nodeIn) {
    return false;
  }
  if (hasAncestor(nodeOut, nodeIn)) {
    return false;
  }
  return true;
};

module.exports = React.createClass({

  getInitialState: function () {
    return {
      open: false
    };
  },

  onToggle: function () {
    this.setState({open: !this.state.open});
  },

  onClose: function () {
    this.setState({open: false});
  },

  onClickDocument: function (event) {
    if (isOutside(event.target, this.refs.select.getDOMNode())) {
      this.onClose();
    }
  },

  fixChoicesWidth: function () {
    this.setState({
      choicesWidth: this.refs.active.getDOMNode().offsetWidth
    });
  },

  onResize: function () {
    this.fixChoicesWidth();
  },

  componentDidMount: function () {
    this.fixChoicesWidth();
    document.addEventListener('click', this.onClickDocument);
    window.addEventListener('resize', this.onResize);
  },

  componentWillUnmount: function () {
    document.removeEventListener('click', this.onClickDocument);
    window.removeEventListener('resize', this.onResize);
  },

  render: function () {
    var selectedLabel = '';
    var matchingLabels = this.props.field.choices.filter(function (choice) {
      return choice.value === this.props.field.value;
    }.bind(this));
    if (matchingLabels.length > 0) {
      selectedLabel = matchingLabels[0].label;
    }

    return R.div({key: this.props.field.key, className: 'field dropdown-field'},
      R.label({},
        this.props.field.label
      ),
      R.div({className: 'dropdown-field', ref: 'select'},
        R.div({className: 'field-value', ref: 'active', onClick: this.onToggle}, selectedLabel),
        R.div({className: 'field-toggle ' + (this.state.open ? 'field-open' : 'field-closed'), onClick: this.onToggle}),
        React.addons.CSSTransitionGroup({transitionName: 'reveal'},
          this.state.open ? R.ul({ref: 'choices', className: 'field-choices', style: {width: this.state.choicesWidth}},
            this.props.field.choices.map(function (choice) {
              return R.li({
                className: 'field-choice',
                onClick: function () {
                  this.setState({open: false});
                  this.props.onChange(choice.value);
                }.bind(this)
              }, choice.label);
            }.bind(this))
          ) : []
        )
      )
    );
  }
});