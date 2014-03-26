var spendit = function ($scope) {
	var endDate = moment("2014/4/10");
	var mock = {
		budget: 8000,
		endDate: endDate,
		expenses: [
			{value: 1000, date: moment()},
			{value: 1000, date: moment()},
			{value: 1000, date: moment().subtract("days",2)},
			{value: 1000, date: moment().subtract("days",2)},
			{value: 10, date: moment().subtract("days",6)},
			{value: 100, date: moment().subtract("days",8)}
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


