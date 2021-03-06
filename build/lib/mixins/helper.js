// # helper mixin

/*
This gets mixed into all helper components.
*/

'use strict';

var _ = require('../undash');

module.exports = {

  // Delegate rendering back to config so it can be wrapped.
  renderWithConfig: function renderWithConfig() {
    return this.props.config.renderComponent(this);
  },

  // Start an action bubbling up through parent components.
  onStartAction: function onStartAction(action, props) {
    if (this.props.onAction) {
      var info = _.extend({}, props);
      info.action = action;
      info.field = this.props.field;
      this.props.onAction(info);
    }
  },

  // Bubble up an action.
  onBubbleAction: function onBubbleAction(info) {
    if (this.props.onAction) {
      this.props.onAction(info);
    }
  },

  onFocusAction: function onFocusAction() {
    this.onStartAction('focus');
  },

  onBlurAction: function onBlurAction() {
    this.onStartAction('blur');
  },

  isReadOnly: function isReadOnly() {
    return this.props.config.fieldIsReadOnly(this.props.field);
  },

  hasReadOnlyControls: function hasReadOnlyControls() {
    return this.props.config.fieldHasReadOnlyControls(this.props.field);
  }
};