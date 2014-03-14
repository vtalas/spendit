/*global moment*/
var Expense = (function () {
	"use strict"

	function Expense(data) {
		this.date = moment(data.date);
		this.value = data.value;
	}


	return Expense;
}());

var ExpenseList = (function () {
	"use strict"

	function ExpenseList(data) {
		var list = data || [],
			i;

		this.list = [];

		for (i = 0; i < list.length; i++) {
			this.list.push(new Expense(list[i]));
		}
	}

	ExpenseList.prototype.sum = function (until) {
		var sum = 0,
			item,
			i;

		for (i = 0; i < this.list.length; i++) {
			item = this.list[i];
			if (until.diff(item.date, "days") > 0) {
				sum += item.value;
			}

		}
		return sum;
	};

	return ExpenseList;
}());
