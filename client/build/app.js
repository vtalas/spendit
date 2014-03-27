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


		list = this.sumByDays();
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
//			if (until && until.diff(currentDate, "days") >= 0) {
//				console.log("xaaax", until.format(), item.date.format(), currentDate.format());
//				break;
//			}

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

/*global moment, ExpenseList*/
var Spendit = (function () {
	"use strict"

	function Spendit(data, today) {
		this.today = today || moment();
		this.budget = data.budget;
		this.endDate = moment(data.endDate);
		this.daysToEnd = this.endDate.diff(this.today, "days");
		/** @type {ExpenseList} */
		this.expenses = new ExpenseList(data.expenses);

	}

	Spendit.prototype.dailyBudget = function () {
		return this.availableBudget() / this.daysToEnd;
	};
	Spendit.prototype.totalSpent = function () {
		return this.expenses.sumAll();
	};

	Spendit.prototype.availableBudget = function () {
		return (this.budget - this.expenses.sumAll());
	};

	Spendit.prototype.addExpense = function (value, moment) {
		var expense = new Expense();
		expense.value = new Number(value, 10);
		expense.date = moment;
		this.expenses.add(expense);
	};

	Spendit.prototype.getExpensesByDay = function () {
		var x = [],
			date = this.today,
			daysTotal = 0,
			oldest = this.expenses.getOldest(),
			expense,
			days = this.expenses.sumByDays();

		if (oldest !== null) {
			daysTotal = date.diff(oldest.date, "days");
		}
		var xxx = days.splice(0, 1);
		for (var i = 0; i < daysTotal; i++) {
			expense = new Expense({date: date, value: 0});
			if (date.diff(xxx.date, "days") === 0) {
				expense = xxx;
				xxx = days.splice(0, 1);
			}

			x.push(expense);
			date = date.subtract("days", 1);

		}
		return x;
	};


	return Spendit;
}());

var spendit = function ($scope) {
	var endDate = moment("2014/4/10");
	var mock = {
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

	$scope.newExpense = null;

	function getExpenses() {
		$scope.list = $scope.a.expenses.sumByDaysExtra(moment("2014/3/10"), endDate);
	}

	$scope.a = new Spendit(mock);

	getExpenses();

	$scope.addExpense = function () {
		$scope.a.addExpense($scope.newExpense, moment());
		getExpenses();
	};
};


