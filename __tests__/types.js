/*global describe, it, expect*/
'use strict';

var printTree = function (node, indent) {
  indent = indent || '';
  if (node && node.childNodes) {
    for (var i = 0; i < node.childNodes.length; i++) {
      var childNode = node.childNodes[i];
      console.log(indent + node.tagName);
      printTree(childNode, indent + '  ');
    }
  }
};

describe('types and value changes', function() {

  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var _ = require('underscore');

  var mounted = function (element) {
    var rendered = TestUtils.renderIntoDocument(element);
    return rendered;
  };

  var Formatic = require('../');

  var formaticConfig = Formatic.createConfig(
    Formatic.plugins.elementClasses,
    function (config) {
      config.addElementClass('single-line-string', 'single-line-string');
      config.addElementClass('string', 'string');
      config.addElementClass('copy', 'copy');
      config.addElementClass('object-item-key', 'object-item-key');
    }
  );

  var Form = React.createFactory(Formatic);

  var testValuteType = function (options) {

    var types = options.type;

    if (!_.isArray(types)) {
      types = [types];
    }

    types.forEach(function (type) {
      it('should change value of ' + type + ' field', function () {

        var formValue;

        var component = mounted(Form({
          fields: [
            {
              type: type,
              key: 'myValue'
            }
          ],
          defaultValue: {
            myValue: options.from
          },
          onChange: function (newValue) {
            formValue = newValue;
          }
        }));

        var node = component.getDOMNode().getElementsByTagName(options.tagName)[0];

        var nodeValue = node.value;
        if (options.getNodeValue) {
          nodeValue = options.getNodeValue(node);
        }
        expect(nodeValue).toEqual(options.from);

        if (options.setNodeValue) {
          options.setNodeValue(node, options.to);
        } else {
          node.value = options.to;
        }

        TestUtils.Simulate.change(node);

        expect(formValue.myValue).toEqual(options.to);
      });
    });
  };

  testValuteType({
    type: ['string', 'text'],
    from: 'hello\ngood-bye',
    to: 'hello\ngood-day',
    tagName: 'textarea'
  });

  testValuteType({
    type: ['single-line-string', 'str', 'unicode'],
    from: 'Joe',
    to: 'Mary',
    tagName: 'input'
  });

  testValuteType({
    type: 'json',
    from: {foo: 'bar'},
    getNodeValue: function (node) {
      return JSON.parse(node.value);
    },
    to: {foo: 'baz'},
    setNodeValue: function (node, value) {
      node.value = JSON.stringify(value);
    },
    tagName: 'textarea'
  });

  testValuteType({
    type: 'boolean',
    from: false,
    getNodeValue: function (node) {
      var optionNode = node.childNodes[node.selectedIndex];
      return formaticConfig.coerceValueToBoolean(optionNode.textContent);
    },
    to: true,
    setNodeValue: function (node, value) {
      var optionNodes = node.childNodes;
      for (var i = 0; i < optionNodes.length; i++) {
        var optionValue = formaticConfig.coerceValueToBoolean(optionNodes[i].textContent);
        if (optionValue === value) {
          node.selectedIndex = i;
        }
      }
    },
    tagName: 'select'
  });

  it('should set value for copy field', function () {

    var msg = 'Just something to read.';

    var component = mounted(Form({
      fields: [
        {
          type: 'copy',
          help_text: msg
        }
      ],
      config: formaticConfig
    }));

    var node = component.getDOMNode().getElementsByClassName('copy')[0];

    expect(node.textContent).toEqual(msg);
  });

  it('should set value for an array', function () {

    var formValue;

    var component = mounted(Form({
      fields: [
        {
          type: 'array',
          key: 'myArray',
          itemFields: [
            {
              type: 'string'
            }
          ]
        }
      ],
      defaultValue: {myArray: ['red', 'green']},
      config: formaticConfig,
      onChange: function (newValue) {
        formValue = newValue;
      }
    }));

    var node = component.getDOMNode().getElementsByClassName('string')[0];

    expect(node.value).toEqual('red');

    node.value = 'blue';

    TestUtils.Simulate.change(node);

    expect(formValue.myArray).toEqual(['blue', 'green']);
  });

  it('should set value and key for an object', function () {

    var formValue;

    var component = mounted(Form({
      fields: [
        {
          type: 'object',
          key: 'myObject',
          itemFields: [
            {
              type: 'string'
            }
          ]
        }
      ],
      defaultValue: {myObject: {x: 'foo', y: 'bar'}},
      config: formaticConfig,
      onChange: function (newValue) {
        formValue = newValue;
      }
    }));

    var node = component.getDOMNode().getElementsByClassName('string')[0];

    expect(node.value).toEqual('foo');

    node.value = 'baz';

    TestUtils.Simulate.change(node);

    expect(formValue.myObject).toEqual({x: 'baz', y: 'bar'});

    node = component.getDOMNode().getElementsByClassName('object-item-key')[0];

    node.value = 'z';

    TestUtils.Simulate.change(node);

    expect(formValue.myObject).toEqual({z: 'baz', y: 'bar'});
  });
});
