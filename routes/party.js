// Create a new party
exports.createParty = function(req, res) {

	new Model.Party(req.body.party).save(function(err){

		if(err) return res.send({success: false, msg: "Error creating party"});

		return res.send({success: true, msg: "Succesful party created"});

	})
};

//Search for parties
exports.searchParty = function(req, res) {

	// Here's the query you'll want! :) .find({"location.latlng" : {$near: [<LONGITUDE>, <LATITUDE>], $maxDistance: 1}})

	Model.Party.find(req.body.party, function(err, result) {
		console.log(result);

		if(err) return res.send({success: false, msg: "404 Party Not Found"});

		return res.send({success: true, msg: "Party Found", party: result});
	});
};