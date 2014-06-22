/*global Spendit, moment
 */
var spendit = function ($scope, $resource, api) {

	$scope.newExpense = null;

	function getExpenses() {
		var end = moment();
		$scope.list = $scope.a.expenses.sumByDays(moment("2014/3/10"), end);
	}

	api.index(function (data) {
		console.log(data);
		$scope.a = new Spendit(data);
		getExpenses();
	});


	$scope.addExpense = function () {
		$scope.a.addExpense($scope.newExpense, moment());
		$scope.newExpense = null;
		getExpenses();
	};
};


