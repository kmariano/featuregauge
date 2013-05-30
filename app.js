
/**
 * Module dependencies.
 */

var express     = require('express')
  , routes      = require('./routes')
  , _           = require('underscore')
  , mongoose    = require('mongoose')
  , db          = mongoose.connect('mongodb://localhost/featuregauge')
  , project     = require('./routes/project')
  , http        = require('http')
  , path        = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
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
app.get('/', routes.index);

app.get('/projects', project.list);
app.get('/project/create', project.add );

app.post('/project/update', project.update );
app.post('/project/delete', project.delete );

app.get('/epics', project.getEpics );
app.get('/epic/create', project.createEpic );
app.post('/epic/update', project.updateEpic );
app.post('/epic/delete', project.deleteEpic );


//app.get('project/vote', project.hasvote );
//app.post('project/vote', project.vote );


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
