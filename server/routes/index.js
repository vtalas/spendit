
/*
 * GET home page.
 */

var moment = require('moment');

exports.index = function(req, res){
	var x = {
		aaa: "askjbsad",
		tiime : moment()
	};

	res.json(x);
};