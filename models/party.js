var mongoose = require('mongoose')
   , Schema = mongoose.Schema
   , ObjectId = Schema.ObjectId;


var partySchema = new Schema({
    name:        	String
    , date_time: 	{}
    , location:		{}
    //, description:  String
});

module.exports = Common.mongoose.model('Party', partySchema);