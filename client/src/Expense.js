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
		var sorted = this.list.slice(0);
		return sorted.sort(function (a, b) {
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
		return this.sortType === sortType.DESC ? last : this.list[0];
	};

	ExpenseList.prototype.sumByDaysExtra = function (from, to) {
		var list,
			i,
			result = [],
			current,
			value = 0,
			totalDays = to.diff(from, "days");

		var delta = this.sortType,
			startDate = delta > 0 ? from.clone() : to.clone();


		list = this.sumByDays(from, to);
		current = list.splice(0, 1)[0];
		for (i = 0; i <= totalDays; i++) {
			value = 0;
			//console.log("xx", startDate.format());
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
		var result = [],
			xxx = {},
			sum = 0,
			item,
			listClone = this.list.slice(0),
			currentDate = null,
			i;

		if (this.list.length === 0) {
			return result;
		}

		var x = true;
		var last;
		while (x) {
			x = listClone.pop();

			if (from && to && x.date.diff(from, "days") >= 0 && x.date.diff(to, "days") <= 0) {
				if (last && last.date.diff(x.date, "days") === 0) {
					console.log(sum += x.value, x.date.format());
				} else {
					sum = x.value;
					//console.log("x", sum, last.date.format());
					//console.log(sum += x.value, x.date.format());
				}
				//console.log(x.value, x.date.format(), sum);
			}

			last = x;
		}

return result;
		for (i = 0; i < this.list.length; i++) {
			item = this.list[i];

			//console.log(from.format(), to.format(), currentDate.format())
			if (from && to && item.date.diff(from, "days") >= 0 && item.date.diff(to, "days") <= 0) {
				if (currentDate === null) {
					currentDate = item.date;
					sum = 0;
				}
				console.log(item.date.diff(from, "days"), item.date.diff(to, "days") ,item.date.format(), from.format(), to.format());


				if (item.date.diff(currentDate, "days") === 0) {
					sum += item.value;
				} else {
					console.log("xx");
					result.push({value: sum + item.value, date: currentDate});
					currentDate = null;
					sum = 0;
				}
			}
		}
//		if (from && to && currentDate.diff(from, "days") > 0 && currentDate.diff(to, "days") < 0) {
//		//	result.push({value: sum, date: currentDate});
//		}

console.log(result.length, "xxx");
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
