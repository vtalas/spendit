/*global Moment, Expense, moment*/
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

	/**
	 *
	 * @param {sortType} order
	 * @returns {Array}
	 */
	ExpenseList.prototype.sort = function (order) {
		order = order || 1;
		var sorted = this.list.slice(0);
		return sorted.sort(function (a, b) {
			return a.date < b.date ? -order : order;
		});
	};

	/**
	 *
	 * @param {Expense} expense
	 */
	ExpenseList.prototype.add = function (expense) {
		this.list.push(expense);
		this.list = this.sort(this.sortType);
		return this;
	};

	/**
	 *
	 * @returns {Expense}
	 */
	ExpenseList.prototype.getOldest = function () {
		var last = this.list[this.list.length - 1];

		if (this.list.length === 0) {
			return null;
		}
		return this.sortType === sortType.DESC ? last : this.list[0];
	};


	ExpenseList.prototype.stripTime = function (date) {
		return moment(date.toArray().splice(0,3));
	};

	ExpenseList.prototype.diffDays = function (source, diffTo) {
		return this.stripTime(source).diff(this.stripTime(diffTo), "days");
	};

	/**
	 *
	 * @param date
	 * @returns {Array<Expense>}
	 */
	ExpenseList.prototype.detail = function (date) {
		var parsed = this.stripTime(moment(date)),
			result = [],
			current,
			i;

		for (i = 0; i < this.list.length; i++) {
			current = this.list[i];
			if (this.diffDays(current.date, parsed) === 0) {
				result.push(new Expense({value: current.value, date: current.date}));
			}
		}

		return result;
	};

	/**
	 *
	 * @param {Moment} from
	 * @param {Moment} to
	 * @returns {Array<Expense>}
	 */
	ExpenseList.prototype.dailyExpenses = function (from, to) {
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
			result.push(new Expense({date: startDate.clone(), value: value}));
			startDate = startDate.add("days", delta);
		}
		return result;
	};

	/**
	 *@public
	 */
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

	/**
	 *
	 * @returns {number}
	 */
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

	/**
	 *
	 * @param until
	 * @returns {number}
	 */
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
