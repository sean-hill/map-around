//////////////////////
// Index Route File //
//////////////////////

exports.landing =  function(req, res){

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(req.headers['user-agent'])) {
		res.redirect("http://maparound-mobile.herokuapp.com")
	}
	else {
		res.render("index")	
	}
	
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
