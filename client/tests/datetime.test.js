/*global it, describe, Spendit, ExpenseList, expect, Expense, moment*/
describe("Describe", function () {
	describe("Test ordering on expenses list", function () {
		it("get oldest with DESC", function () {
			var data = [
					{value: 5, date: "2014/3/5"},
					{value: 2, date: "2014/2/2"},
					{value: 1, date: "2014/2/1"}
				],
				list = new ExpenseList(data);
			
			expect(list.getOldest().value).toBe(1);
		});

		it("get oldest with DESC", function () {
			var data = [],
				list = new ExpenseList(data);
			expect(list.getOldest()).toBeNull();
		});
	});

	describe("Expenses List with days sorted DESC", function () {
		var today = moment("2014/3/31"),
			endDate = moment("2014/3/2"),
			model = {
				budget: 8000,
				endDate: endDate,
				expenses: [
					{value: 5, date: "2014/3/5"},
					{value: 4, date: "2014/3/4"},
					{value: 3, date: "2014/3/3"},
					{value: 2, date: "2014/2/2"},
					{value: 1, date: "2014/2/1"}
				]
			};


		it("sum until some date", function () {
			var list = new ExpenseList(model.expenses);
			expect(list.sumUntil(endDate)).toBe(3);
			expect(list.sumUntil(today)).toBe(15);
		});

		it("sum all expenses", function () {
			var list = new ExpenseList(model.expenses);
			expect(list.sumAll()).toBe(15);
		});

		it("new record should be on correct position", function () {
			var list = new ExpenseList(model.expenses);
			list.add(new Expense({date: moment("2014/6/1"), value: 999}));
			expect(list.list[0].value).toBe(999);
		});

		it("2 days, 3 expenses/day sumByDays should get 2 records ", function () {
			var data = [
					{value: 30, date: "2014/3/2"},
					{value: 30, date: "2014/3/2"},
					{value: 1, date: "2014/3/1"},
					{value: 1, date: "2014/3/1"},
					{value: 1, date: "2014/3/1"},
					{value: 30, date: "2014/3/2"},
				],

				list = new ExpenseList(data),
				sumByDay = list.sumByDays();
			expect(sumByDay.length).toBe(2);

			expect(sumByDay[0].value).toBe(90);
			expect(sumByDay[1].value).toBe(3);
		});

		it("sum by days", function () {
			var list = new ExpenseList([]),
				sumByDay = list.sumByDays();
			expect(sumByDay.length).toBe(0);
		});

		it("sum by days including days without expenses", function () {
			var data = [
					{value: 30, date: "2014/3/2"},
					{value: 30, date: "2014/3/2"},
					{value: 1, date: "2014/3/1"},
					{value: 1, date: "2014/3/1"},
					{value: 1, date: "2014/3/21"},
					{value: 33, date: "2014/3/20"},
				],
				list = new ExpenseList(data),
				sumByDay;

			sumByDay = list.sumByDaysExtra(moment("2014/3/1"), moment("2014/3/25"));
			for (var i = 0; i < sumByDay.length; i++) {
				var obj = sumByDay[i];
				//console.log(obj.value);
			}
			expect(sumByDay.length).toBe(25);
		});

		it("order asc", function () {
			var list = new ExpenseList(model.expenses);
			expect(list.sort()[0].value).toBe(1);
			expect(list.sort()[4].value).toBe(5);
		});

		it("order desc", function () {
			var list = new ExpenseList(model.expenses);
			expect(list.sort(-1)[0].value).toBe(5);
			expect(list.sort(-1)[4].value).toBe(1);
		});
	});
});