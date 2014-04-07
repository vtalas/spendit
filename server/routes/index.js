var moment = require('moment');


exports.index = function (req, res) {
	var endDate = moment("2014/4/10"),
		mock = {
			budget: 8000,
			endDate: endDate,
			expenses: [
				{value: 1000, date: moment()},
				{value: 1000, date: moment()},
				{value: 1000, date: moment().subtract("days", 2)},
				{value: 1000, date: moment().subtract("days", 2)},
				{value: 10, date: moment().subtract("days", 6)},
				{value: 100, date: moment().subtract("days", 8)}
			]
		};
	res.json(mock);
};

exports.get = function (req, res) {
	//var page = pages[req.params.page];

	console.log("x", req.params);
	res.json({"xx" :req.params});
};
