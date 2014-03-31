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

