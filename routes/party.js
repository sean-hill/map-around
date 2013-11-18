// Create a new party
exports.createParty = function(req, res) {

	new Model.Party(req.body.party).save(function(err){

		if(err) return res.send({success: false, msg: "Error creating party"});

		return res.send({success: true, msg: "Succesful party created"});

	})
};

//Search for parties
exports.searchParty = function(req, res) {
	
	var searchData = req.body.search;
	//TODO: figure out max distance (should be in meters can calulate from map)
	
	Model.Party.find({"location.latlng" : {$near: searchData.location.latlng, $maxDistance: 100}}, function(err, parties){
		if(err) return res.send({success: false, msg: "404 Party Not Found"});

		return res.send({success: true, msg: "Parties Found", parties: parties});
	});
};