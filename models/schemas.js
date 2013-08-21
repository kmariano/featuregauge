var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 models.js
 - This file contains all the mongoose schemas
 **/

/*
 */
exports.FeatureSchema = new Schema({
    name        : String,
    description : String,
    votecount   : {type: Number, default : 0 }
});

/**
 * Project
 * A project can contain one or more features (features that a user can vote for).
 *
 * @type {Schema}
 */
exports.ProjectSchema = new Schema({
    name    : String,
    summary : String,
    features   : [exports.FeatureSchema]
});



/**
 * Vote Schema
 * A vote is a record of a user voting for a feature. A vote consists of the following properties
 * userID : ObjectId of the given user
 * projectID: ObjectId of the given project
 * featureID : identifier of the given object
 * votetype: The type of vote 'U' is an up vote, 'D' is a down vote.
 * votedate
 *
 */
exports.VoteSchema  = new Schema({
    userID: Schema.Types.ObjectId,
    projectID: Schema.Types.ObjectId,
    featureID: Schema.Types.ObjectId,
    votetype: String,
    votedate: Date
});

