
describe("Describe", function () {
	it("Test 1", function () {
		var x = moment();

		//console.log(moment("2014/4/10").diff(moment(), "days"));
	});
	it("description", function () {
		var model = {
			budget: 8000,
			endDate: moment("2014/4/10"),
		};


		var x = new Spendit(model, moment("2014/3/31"));
		expect(x.daysToEnd).toBe(10);
		expect(x.dailyBudget).toBe(800);

	});
	it("expenses List", function () {
		var model = {
			budget: 8000,
			endDate: moment("2014/4/10"),
			expenses : [
				{value: 100, date: "2014/3/31"},
				{value: 100, date: "2014/3/31"},
				{value: 2, date: "2014/4/10"},
				{value: 3, date: "2014/5/10"}
			]
		};


		var x = new ExpenseList(model.expenses);
		console.log(x.sum(moment("2014/4/10")));

	});
});