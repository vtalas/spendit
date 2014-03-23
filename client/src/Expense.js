/*global moment*/
var Expense = (function () {
	"use strict"

	function Expense(data) {
		data = data || {};
		this.date = moment(data.date);
		this.value = data.value;
	}

	return Expense;
}());

var ExpenseList = (function () {
	"use strict"

	var sortType = {
		DESC: -1,
		ASC: 1
	};

	function ExpenseList(data) {
		var list = data || [],
			i;

		this.list = [];
		this.sortType = sortType.DESC;

		for (i = 0; i < list.length; i++) {
			this.list.push(new Expense(list[i]));
		}
		this.list = this.sort(this.sortType);
	}

	ExpenseList.prototype.sort = function (order) {
		order = order || 1;
		return this.list.sort(function (a, b) {
			return a.date < b.date ? -order : order;
		});
	};

	ExpenseList.prototype.add = function (expense) {
		this.list.push(expense);
		this.list = this.sort(-1);
	};

	ExpenseList.prototype.getOldest = function () {
		var last = this.list[this.list.length - 1];

		if (this.list.length === 0) {
			return null;
		}
		return this.sortType === sortType.DESC  ? last : this.list[0];
	};

	ExpenseList.prototype.sumByDays = function () {
		var result = [],
			sum = 0,
			item,
			currentDate,
			i;

		if (this.list.length === 0) {
			return result;
		}

		currentDate = this.list[0].date;
		for (i = 0; i < this.list.length; i++) {
			item = this.list[i];
			if (item.date.diff(currentDate, "days") === 0) {
				sum += item.value;
			} else {
				result.push({value: sum, date: currentDate});
				sum = item.value;
				currentDate = item.date;
			}
		}
		result.push({value: sum, date: currentDate});

		return result;
	};

	ExpenseList.prototype.sumAll = function () {
		var sum = 0,
			item,
			i;

		for (i = 0; i < this.list.length; i++) {
			item = this.list[i];
			sum += item.value;
		}
		return sum;
	};

	ExpenseList.prototype.sumUntil = function (until) {
		var sum = 0,
			item,
			i;

		for (i = 0; i < this.list.length; i++) {
			item = this.list[i];
			if (until.diff(item.date, "days") >= 0) {
				sum += item.value;
			}
		}
		return sum;
	};

	return ExpenseList;
}());
