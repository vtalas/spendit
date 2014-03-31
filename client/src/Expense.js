/*global moment*/
var Expense = (function () {
	"use strict";

	function Expense(data) {
		data = data || {};

		if (data.date && data.date._isAMomentObject) {
			this.date = data.date;
		}
		if (typeof data.date === "string") {
			this.date = moment(data.date);
		}
		this.dateFromated = this.date.format();
		this.value = data.value;
	}

	return Expense;
}());

var ExpenseList = (function () {
	"use strict";

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
		var sorted = this.list.slice(0);
		return sorted.sort(function (a, b) {
			return a.date < b.date ? -order : order;
		});
	};

	ExpenseList.prototype.add = function (expense) {
		this.list.push(expense);
		this.list = this.sort(this.sortType);
	};

	ExpenseList.prototype.getOldest = function () {
		var last = this.list[this.list.length - 1];

		if (this.list.length === 0) {
			return null;
		}
		return this.sortType === sortType.DESC ? last : this.list[0];
	};

	ExpenseList.prototype.sumByDaysExtra = function (from, to) {
		var list,
			i,
			result = [],
			current,
			value = 0,
			delta,
			startDate,
			totalDays;

		totalDays = to.diff(from, "days");

		delta = this.sortType;
		startDate = delta > 0 ? from.clone() : to.clone();


		list = this.sumByDays(from, to);
		current = list.splice(0, 1)[0];
		for (i = 0; i <= totalDays; i++) {
			value = 0;
			if (current && current.date.diff(startDate, "days") === 0) {
				value = current.value;
				current = list.splice(0, 1)[0];
			}
			result.push({date: startDate.clone(), value: value});
			startDate = startDate.add("days", delta);
		}
		return result;
	};

	ExpenseList.prototype.sumByDays = function (from, to) {
		var sum = 0,
			current = {},
			last,
			temp = {},
			toArray = function () {
				var result = [],
					item;

				for (item in temp) {
					if (temp.hasOwnProperty(item)) {
						result.push(temp[item]);
					}
				}
				return result;
			},
			isInInterval = function (item) {
				if (from && to) {
					return item.date.diff(from, "days") >= 0 && item.date.diff(to, "days") <= 0;
				}
				return true;
			},
			listClone;

		if (this.list.length === 0) {
			return [];
		}
		listClone = this.list.slice(0).reverse();

		while (current) {
			current = listClone.pop();

			if (!current) {
				break;
			}
			if (isInInterval(current)) {
				if (last && last.date.diff(current.date, "days") === 0) {
					sum += current.value;
				} else {
					sum = current.value;
				}
				temp[current.date.format("DD/MM/YYYY")] = new Expense({value: sum, date: current.date});
			}
			last = current;
		}

		return toArray(temp);
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
