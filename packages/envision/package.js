Package.describe({
  summary: "Envision.js graphs"
});

Package.on_use(function (api) {
  api.use('jquery');

  var path = Npm.require('path');
  var asset_path = path.join('envision');
  api.add_files(path.join(asset_path, 'envision.min.css'), 'client');
  api.add_files(path.join(asset_path, 'envision.min.js'), 'client');

});
