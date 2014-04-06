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
		var end = moment();
		$scope.list = $scope.a.expenses.sumByDays(moment("2014/3/10"), end);
		console.log($scope.list, $scope.a.expenses.list);
	}

	$scope.a = new Spendit(mock);

	getExpenses();

	$scope.addExpense = function () {
		$scope.a.addExpense($scope.newExpense, moment());
		$scope.newExpense = null;
		getExpenses();
	};
};


