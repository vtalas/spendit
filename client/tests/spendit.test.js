/*global it, describe, Spendit, ExpenseList, expect, Expense, moment*/
describe("Describe", function () {
	var today = moment("2014/3/10"),
		endDate = moment("2014/3/31"),
		oldestExpnese = moment("2014/3/1"),
		model = {
			budget: 8000,
			endDate: endDate,
			expenses: [
				{value: 1, date: oldestExpnese},
				{value: 2, date: "2014/3/10"},
				{value: 3, date: "2014/3/20"}
			]
		};

	it("Calculate daily budget and days to end", function () {
		var x = new Spendit(model, today);
		expect(x.daysToEnd).toBe(21);
		expect(x.totalSpent()).toBe(6);
		expect(x.availableBudget()).toBe(8000 - x.totalSpent());
	});

	xit("sum by days should show all days sums", function () {
		var x = new Spendit(model, today),
			sumByDays = x.getExpensesByDay();

		console.log(JSON.stringify(moment().add("d", -1)));

		console.log(sumByDays.length);
		expect(sumByDays.length).toBe(endDate.diff(oldestExpnese, "days"));

	});

});

