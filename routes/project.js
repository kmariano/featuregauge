var schemas = require('../models/schemas');
var mongoose = require('mongoose');

//Return all projects sorted by vote count
var Project = mongoose.model('Projects', schemas.ProjectSchema);
var Feature = mongoose.model('Features', schemas.FeatureSchema );

/*
 * GET all projects.
 */
exports.list = function(req, res){

    Project.find({},function(err, projects )
    {
        if( err )
        {
            res.send(err);
        }
        else
        {
            res.json( projects);
        }
    });
};

/*
  HTTP VERB - POST

  Parameters:
  - Name    (Required)
  - Summary (Optional)
  Creates a project with the given name in the database

  Returns
    - success (Maybe change to the project Id?) if the project was created successfully.
    - error (otherwise)

 */
exports.add = function(req, res){

      //Summary is optional
      var proj = req.body;


      if( ! proj.name )  {
        res.send(500, 'Missing  project name') ;
      }

      var newProject = new Project({name: proj.name,
          summary : proj.summary});

      console.log(newProject.name);
      console.log(newProject.summary);

      newProject.save(function ( err, project ){
         if( err )
         {
             console.log( err );
             res.send('error');
         }
         else
         {
            res.send(project);
         }
      });

}

/**
 * Finds a single project by an id parameter
 * @param req
 * @param res
 */
exports.find = function(req, res){
    //TODO check if project id parameter exists otherwise route to error
    var projectId = req.params.id;
    Project.findOne({'_id' : projectId }, function( err, project ) {
          if( err ){
              console.log("Error could not find project with id =:" + projectId );
              res.send( 500, {'error' : 'cound not find project with id =:' + projectId});
              //TODO - Either redirect to a 500 or return an error.
          }else{
              res.send( project );
          }
    }) ;

}

//project.update
//PUT /project/:id
//Allows users to update the name and summary of an existing project
//returns the updated Project.
exports.update = function(req, res){
    var projectId = req.params.id;
    var name = req.body.name;
    var summary = req.body.summary;
    Project.findByIdAndUpdate( projectId, {'name' : name, 'summary' : summary }, function(err, project ){
        if( err ){
            res.send(500, "error updating project with id: " + projectId);
        }else{
            res.send(project);
        }
    });
}

//project.delete
//DELETE /project/:id
//Allows users to remove a project and all its features from the system.
//returns the updated Project.
exports.delete  = function(req, res) {
      var projectId = req.params.id;
      if( projectId ){
          Project.findByIdAndRemove(projectId, function( err, project ) {
              if( err ){
                  console.log("Could not delete project with id: " + projectId );
              } else{
                  res.send("success");
              }
          });
      }else{
          res.send(500, {"error" : "missing id parameter"});
      }
};
//project.delete
//DELETE /project/:id
//Allows users to remove a project and all its features from the datastore
//returns the updated Project.
exports.getFeatures = function( req, res){

}

//project.createFeature
//POST /project/:id/feature/create
//Create a new feature in an existing project.
//returns the updated Project.
exports.createFeature  = function (req, res){
    var projectId   = req.body.projectid ;
    var featureName =  req.body.name;
    var featureDesc = req.body.description;
    if( ! featureName ){
        res.send(500, {"error" : "missing required field: name . Could not create feature for project"})
    }
    if( projectId ){
          Project.findById( projectId, function( err, project ){
              if(err){

              }else if(project == null){
                  res.send(500, "error could not find project with id:" + projectId);
              }
              else{
                  //create a new feature and save the parent document.
                  var feature = new Feature({name: featureName, description: featureDesc, votecount: 0 });
                  project.features.push(feature);
                  project.save( function (err, data ){
                     if( err ){
                         res.send(500, {"error" : err});
                     } else {
                         console.log(data.features[0]);
                         res.send(200, feature );
                     }
                  });
              }
          } );
    } else{
        res.send(500, {"error" : "missing projectId parameter" } )
    }

}

//project.updateFeature
//PUT /feature/:id/update
//Updates an existing feature. Modifies an existing features name or description
exports.updateFeature = function( req, res ) {
    var featureId = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    //Find the Project that has the feature with the given feature id, update the name and description if they have been set.
    Project.findOne({'features._id' : featureId}).exec(function(err, project ){
        //The id was bogus notify the user.
        if( err ) {
            res.send( 500, err );
        }

        if( project == null ) {
            res.send(500, {"error" : "Parent project with featureId:" + featureId +" could not be found. "});
        } else {
            var feature = project.features.id(featureId);
            //Check if the name and description have been set and update the feature name and description with the new
            //values.
            if( name ) {
                feature.set('name', name);
            }
            if( description ){
                feature.set('description', description );
            }
            //we can't save the subdocument so we have to save the parent document.
            project.save( function ( error ){
                if( error ) {
                    res.send( 500, {"error" : err })
                }
                res.send(200, feature ) ;
            });
        }
    });
}

exports.findFeatureById = function( req, res ){
    var featureId = req.params.id;
    Project.findOne({'features._id' : featureId }).exec(function( err, project ){
        if(err){
            res.send(500, err);
        } else {
            res.send(200, project.features.id( featureId ) );
        }
    });
}


exports.deleteFeature = function(req, res) {

}

exports.upVoteFeature = function ( req, res ) {
}

exports.downVoteFeature = function( req, res ) {
}