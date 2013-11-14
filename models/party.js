var mongoose = require('mongoose')
   , Schema = mongoose.Schema
   , ObjectId = Schema.ObjectId;


var partySchema = new Schema({
    title:        	String
    , description:  String
    , location:		{}
});

module.exports = Common.mongoose.model('Party', partySchema);