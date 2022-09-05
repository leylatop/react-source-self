import React from './react/index'
import ReactDOM from './react-dom/index'

// import React from 'react'
// import ReactDOM from 'react-dom'

class Counter extends React.Component {
	static defaultProps = {
		name: 'qiaoxiaoxin'
	}
	constructor(props) {
		super(props);
		this.state = {
			number: 0
		}
		console.log('1.constructor')
	}
	componentWillMount() {
		console.log('2.componentWillMount')
	}

	componentDidMount() {
		console.log('4.componentDidMount')
	}
	// 当state更新后发生会调用此方法，或者当父组件传入子组件的属性发生变化后，也会调用此方法
	/**
	 * 
	 * @param {*} nextProps 最新的属性
	 * @param {*} nextState 最新的状态
	 * @returns 是否要进行更新
	 */
	shouldComponentUpdate(nextProps, nextState) {
		console.log('5.shouldComponentUpdate')
		return nextState.number % 2 === 0;	// 判断条件
	}

	componentWillUpdate(nextProps, nextState) {
		console.log('6.componentWillUpdate')
	}

	componentDidUpdate(prevProps, prevState) {
		console.log('7.componentDidUpdate')
	}

	addCounter = () => {
		this.setState({ number: this.state.number + 1 })
	}

	render() {
		console.log('3.render')
		return (
			<div>
				<p>{this.state.number}</p>
				{this.state.number === 4 ? null : <ChildCounter count={this.state.number}/>}
				<button onClick={this.addCounter}>add</button>
			</div>
		)
	}
}

class ChildCounter extends React.Component {
	static defaultProps = {
		name: 'childcounter'
	}
	componentWillMount() {
		console.log('1. childcounter componentWillMount')
	}
	render() {
		console.log('2. childcounter render')
		return(
			<p className="childCounter">childcounter： {this.props.count}</p>
		)
	}
	componentDidMount() {
		console.log('3. childcounter componentDidMount')
	}

	componentWillReceiveProps() {
		console.log('4. childcounter componentWillReceiveProps')
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log('5. childcounter shouldComponentUpdate')
		return nextProps.count % 3 === 0;	// 如果是3的倍数才更新，其余的不更新
	}

	componentDidUpdate(prevProps, prevState) {
		console.log('6. childcounter componentDidUpdate')
	}

	componentWillUnmount() {
		console.log('7. childcounter componentWillUnmount')
	}
	
}
ReactDOM.render(<Counter />, document.getElementById('root'))

