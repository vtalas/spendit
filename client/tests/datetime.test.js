
describe("Describe", function () {
	it("Test 1", function () {
		var x = moment();

//		console.log(moment("2014/4/10").diff(moment(), "days"));
	});
	it("description", function () {
		var model = {
			budget: 8000,
			endDate: moment("2014/4/10")
		};

		var x = new Spendit(model, moment("2014/3/15"));
		expect(x.daysToEnd).toBe(26);

		console.log(x.dayBudget);

	});
});