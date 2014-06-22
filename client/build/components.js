/**
 * @jsx React.DOM
 */

var helloWorld = React.createClass({
	render: function () {
		//return React.DOM.h2(null, 'Hello, world!  sd' + this.props.param);
		return (<h1>hello {this.props.param}</h1>);
	}
});

//React.renderComponent(prdel(), document.getElementById('hello'));

var expenseRender = React.createClass({
	buttonClick: function () {
		this.props.onDelete(this.props.expense);
	},
	render: function () {
		/** @type Expense */
		var expense = this.props.expense;
		return (<div>{expense.dateFromated}..{expense.value} <button onClick={this.buttonClick}>delete</button></div>);
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
	buttonClick: function () {
		var exp = new Expense({value: this.state.value, date:moment()}),
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
			rows.push(<expenseRender ref="chuj" onDelete={this.onDeleteExpense} expense={expense}></expenseRender>)
		}
		return (
			<div>
				<button onClick={this.dailyClick} >daily </button>
				<button onClick={this.sumByDaysClick} >by days </button>
				<button onClick={this.buttonClick} >click </button>
				<input onChange={this.onChange} value={this.state.value}/>
				<helloWorld param={"testssss"}/>
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