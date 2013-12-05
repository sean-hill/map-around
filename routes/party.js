// // DEPRECATED
//
// //////////////////////
// // Party Route File //
// //////////////////////

// // Create a new party
// exports.createParty = function(req, res) {

// 	new Model.Party(req.body.party).save(function(err){

// 		if(err) return res.send({success: false, msg: "Error creating party"});

// 		return res.send({success: true, msg: "Succesful party created"});

// 	})
// };

// //Search for parties
// exports.searchParty = function(req, res) {
	
// 	var searchData = req.body.search;
// 	var searchStart = new Date(searchData.start_date);
// 	var searchEnd = new Date(searchData.end_date);

// 	// ESD is not > SED and EED is not <= SSD

// 	var query = {
// 		"location.latlng" : {$near: searchData.location.latlng, $maxDistance: milesToRadians(searchData.distance)}
// 		, "date_time.start_date" : { $not : { $gt : searchEnd } }
// 		, "date_time.end_date" : { $not: { $lte : searchStart } }
// 	};

// 	Model.Party.find(query, function(err, parties){

// 		if(err) return res.send({success: false, msg: "No parties found"});

// 		return res.send({success: true, msg: "Parties Found", parties: parties});
		
// 	});
// };

// milesToRadians = function (miles) {
//   var EARTH_RADIUS_MILES = 3959 * (3.14/180); // miles
//   return miles / EARTH_RADIUS_MILES;
// }