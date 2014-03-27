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
