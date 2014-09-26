'use strict';

var React = require('react/addons');
var R = React.DOM;
var _ = require('underscore');

module.exports = function (formatic, plugin) {

  plugin.view = React.createClass({

    getDefaultProps: function () {
      return {
        className: plugin.config.className
      };
    },

    onChange: function (event) {
      this.props.onSelect(parseInt(event.target.value));
    },

    render: function () {

      var field = this.props.field;

      var typeChoices = null;
      if (field.get('items')) {
        typeChoices = R.select({className: this.props.className, value: this.value, onChange: this.onChange},
          field.get('items').toArray().map(function (item, i) {
            return R.option({key: i, value: i}, item.get('label') || i);
          })
        );
      }

      return typeChoices ? typeChoices : R.span(null);
    }
  });
};