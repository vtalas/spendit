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

		it("kajsbd ", function () {
			var data = [
					{value: 1, date: "2014/3/1"},
					{value: 2, date: "2014/3/2"},

					{value: 3, date: "2014/3/3"},
					{value: 3, date: "2014/3/3"},
					{value: 3, date: "2014/3/3"},

					{value: 4, date: "2014/3/4"},
					{value: 4, date: "2014/3/5"},
					{value: 4, date: "2014/3/6"}
				],

				list = new ExpenseList(data),
				sumByDay = list.sumByDays(moment("2014/3/2"), moment("2014/3/4"));


			printExpenses(sumByDay)
return ;
			expect(sumByDay.length).toBe(3);
			checkExpense(sumByDay[0], 4, "2014/3/4");
			checkExpense(sumByDay[1], 3, "2014/3/3");
			checkExpense(sumByDay[2], 2, "2014/3/2");

		});

		it("sum by days", function () {
			var list = new ExpenseList([]),
				sumByDay = list.sumByDays();
			expect(sumByDay.length).toBe(0);
		});

		function printExpenses(expenses) {
			var i;

			for (i = 0; i < expenses.length; i++) {
				var obj = expenses[i];
				console.log("--", obj.value, obj.date.format());
			}
		}

		function checkExpense(expense, expectedValue, expectedDate) {
			var x = moment(expectedDate);

			expect(expense.value).toBe(expectedValue);
			expect(expense.date.diff(x, "days")).toBe(0);

		}

		xit("sum by days including days without expenses, expenses are INSIDE interval from-to", function () {
			var data = [
					{value: 30, date: "2014/3/2"},
					{value: 30, date: "2014/3/2"},
					{value: 1, date: "2014/3/1"},
					{value: 1, date: "2014/3/1"},
					{value: 1, date: "2014/3/21"},
					{value: 33, date: "2014/3/20"}
				],
				list = new ExpenseList(data),
				sumByDay;

			sumByDay = list.sumByDaysExtra(moment("2014/3/1"), moment("2014/3/22"));

			checkExpense(sumByDay[0], 0, "2014/3/22");
			checkExpense(sumByDay[1], 1, "2014/3/21");
			checkExpense(sumByDay[21], 2, "2014/3/1");

			expect(sumByDay.length).toBe(22);
		});

		xit("sum by days including days without expenses, expenses are NOT INSIDE from-to", function () {
			var data = [
					{value: 1, date: "2014/3/20"},
					{value: 22, date: "2014/3/22"},
					{value: 33, date: "2014/3/25"}
				],
				list = new ExpenseList(data),
				sumByDay;

			sumByDay = list.sumByDays(moment("2014/3/21"), moment("2014/3/23"));
			printExpenses(sumByDay);

			//expect(sumByDay.length).toBe(3);
			checkExpense(sumByDay[0], 0, "2014/3/23");
			checkExpense(sumByDay[1], 22, "2014/3/22");
			checkExpense(sumByDay[2], 0, "2014/3/21");

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