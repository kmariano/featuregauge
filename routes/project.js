var schemas = require('../models/schemas');
var mongoose = require('mongoose');

//Return all projects sorted by vote count
var Project = mongoose.model('Projects', schemas.ProjectSchema);
var Feature = mongoose.model('Features', schemas.FeatureSchema );

/*
 * GET home page.
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
  GET
  /project/create
  - Name
  - Summary
 */
exports.add = function(req, res){



      var name = req.query.name;
      var summary = req.query.summary;

      var newProject = new Project({name: name,
          summary : summary});

      console.log(newProject.name);
      console.log(newProject.summary);

      newProject.save(function ( err ){
         if( err )
         {
             console.log( err );
             res.send('error');
         }
         else
         {
            res.send('success');
         }
      });

}

exports.update = function(req, res){

}

exports.delete  = function(req, res){

};

exports.getFeatures = function( req, res){

}

exports.createFeature  = function (req, res){

}

exports.updateFeature = function( req, res ){

}

exports.deleteFeature = function(req, res){

}