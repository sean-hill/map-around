//////////////////////
// Index Route File //
//////////////////////

exports.landing =  function(req, res){
	res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
