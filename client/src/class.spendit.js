/*global moment*/
var Spendit = (function () {
	"use strict"

	function Spendit(data, today) {
		this.today = today || moment();
		this.budget = data.budget;
		this.endDate = moment(data.endDate);
		this.daysToEnd = this.endDate.diff(this.today, "days");
		this.expenses = new ExpenseList(data.expenses);

		this.dailyBudget = this.budget / this.daysToEnd;
	}

	Spendit.prototype.xxx = function () {

	};


	return Spendit;
}());
