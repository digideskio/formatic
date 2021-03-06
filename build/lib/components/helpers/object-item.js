// # object-item component

/*
Render an object item.
*/

'use strict';

var React = require('react');
var R = React.DOM;
var cx = require('classnames');

module.exports = React.createClass({

  displayName: 'ObjectItem',

  mixins: [require('../../mixins/helper')],

  onChangeKey: function onChangeKey(newKey) {
    this.props.onMove(this.props.itemKey, newKey);
  },

  render: function render() {
    return this.renderWithConfig();
  },

  renderDefault: function renderDefault() {
    var config = this.props.config;
    var field = this.props.field;

    return R.div({ className: cx(this.props.classes) }, config.createElement('object-item-key', { field: field, onChange: this.onChangeKey, onAction: this.onBubbleAction, displayKey: this.props.displayKey, itemKey: this.props.itemKey }), config.createElement('object-item-value', { field: field, onChange: this.props.onChange, onAction: this.onBubbleAction, itemKey: this.props.itemKey }), config.createElement('object-item-control', { field: field, onRemove: this.props.onRemove, itemKey: this.props.itemKey }));
  }
});