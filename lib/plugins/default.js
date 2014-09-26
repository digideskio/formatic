'use strict';

module.exports = function (formatic) {

  formatic.plugin('core');
  formatic.plugin('prop-aliases');

  formatic.filterPluginsInRegistry(function (plugin) {
    return plugin.name.indexOf('views.') === 0;
  }).forEach(function (plugin) {
    formatic.plugin(plugin.name);
  });

  formatic.route('object', 'fieldset');
  formatic.route('string', 'select', function (field) {
    return field.choices() ? true : false;
  });
  formatic.route('string', 'text', function (field) {
    return field.get('maxLines') === 1;
  });
  formatic.route('string', 'textarea');
  formatic.route('array', 'list');
};