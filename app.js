
/**
 * Module dependencies.
 */

var express     = require('express')
  , _           = require('underscore')
  , mongoose    = require('mongoose')
  , db          = mongoose.connect('mongodb://localhost/featuregauge')
  , project     = require('./routes/project')
  , http        = require('http')
  , path        = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3005);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(app.router);

  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//setup routes
app.get('/projects', project.list);
app.post('/project/create', project.add );
app.get('/project/:id', project.find );
app.put('/project/:id/update', project.update );
app.delete('/project/:id/delete', project.delete );

app.get('/project/:id/features', project.getFeatures );
app.post('/project/:id/feature/create', project.createFeature );
app.put('/feature/:id/update', project.updateFeature );
app.delete('/feature/:id/delete', project.deleteFeature );
app.get('/feature/:id', project.findFeatureById );

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
