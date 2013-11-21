var mongoose = require('mongoose')
   , Schema = mongoose.Schema
   , ObjectId = Schema.ObjectId;


var partySchema = new Schema({
    name:        	String
    , date_time: 	{start_date: Date, end_date: Date, all_day: Boolean}
    , location:		{latlng: [], address: String}
    , description:  String
});

partySchema.index ({
  "location.latlng": "2d"
});

module.exports = Common.mongoose.model('Party', partySchema);