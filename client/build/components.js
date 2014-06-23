/**
 * @jsx React.DOM
 */
/*global React*/
"use strict";

var expenseRender = React.createClass({
	getInitialState: function () {
		return {
			details: []
		};
	},
	buttonClick: function () {
		this.props.onDelete(this.props.expense);
	},
	detailClick: function () {
		var expense = this.props.expense,
			expenseList = this.props.expensesList;

		this.setState({details: expenseList.detail(expense.date)});
	},
	render: function () {
		var rows = [],
			i,
			expense = this.props.expense;

		for (i = 0; i < this.state.details.length; i++) {
			rows.push(<div>{this.state.details[i].value}</div>);
		}

		return (
			<div>{expense.dateFromated}..{expense.value}
				<button onClick={this.detailClick}>detail</button>
				<button onClick={this.buttonClick}>delete</button>
				<div>{rows}</div>
			</div>
			);
	}

});


var expen = React.createClass({
	getInitialState: function () {
		var from = moment().subtract("days", 8),
			expensesList = this.props.data,
			to = moment();

		return {
			value: "",
			expensesList: expensesList,
			getItems: function () {
				return expensesList.dailyExpenses(from, to);
			},
			from: from,
			to: to
		};
	},
	addNewClick: function () {
		var exp = new Expense({value: this.state.value, date: moment()}),
			newitems = this.state.expensesList.add(exp);

		this.setState({value: "", expensesList: newitems});
	},

	dailyClick: function () {
		var from = this.state.from,
			self = this,
			to = this.state.to;

		this.setState({getItems: function () {
			return self.props.data.dailyExpenses(from, to);
		}});
	},

	sumByDaysClick: function () {
		var from = this.state.from,
			self = this,
			to = this.state.to;

		this.setState({getItems: function () {
			return self.props.data.sumByDays(from, to);
		}});
	},
	onChange: function (e) {
		this.setState({value: e.target.value});
	},
	onDeleteExpense: function (item) {
		console.log("delete this one", item);
	},
	render: function () {
		var from = this.state.from,
			to = this.state.to,
			serverData = this.state.getItems(),
			expense,
			rows = [];

		for (var i = 0; i < serverData.length; i++) {
			expense = serverData[i];
			rows.push(
				<expenseRender
				ref="chuj"
				onDelete={this.onDeleteExpense}
				expense={expense}
				expensesList={this.state.expensesList}
				>
				</expenseRender>)
		}
		return (
			<div>
				<button onClick={this.dailyClick} >daily </button>
				<button onClick={this.sumByDaysClick} >by days </button>
				<button onClick={this.addNewClick} >click </button>
				<input onChange={this.onChange} value={this.state.value}/>
				<div className="aa">{rows}</div>
			</div>);
	}
});

var expenses = [
	{value: 1000, date: moment()},
	{value: 1000, date: moment()},
	{value: 1000, date: moment().subtract("days", 2)},
	{value: 1000, date: moment().subtract("days", 2)},
	{value: 10, date: moment().subtract("days", 6)},
	{value: 100, date: moment().subtract("days", 8)}
];
var ddd = new ExpenseList(expenses);

React.renderComponent(<expen data={ddd}/>, document.getElementById('example'));