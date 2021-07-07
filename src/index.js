import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
	state = {
		number: 0
	}
	
	handleClick = (event) => {
		// 在事件处理函数中，setState的调用会批量执行；setState并不会修改this.state，所以每次this.state的值都是原来的值，等事件结束后，再进行更新
		this.setState({
			number: this.state.number + 1
		}, () => {
			console.log('callback', this.state.number);
		})
		console.log('handleClick', this.state.number);	// 0
	}
	render() {
		return (
			<SubCounter number={this.state.number} handleClick={this.handleClick}/>
		)
	}
}

function SubCounter(props) {
	return (
		<div>
			<p>{props.number}</p>
			<button onClick={props.handleClick}>增加</button>
		</div>
	)
}

ReactDOM.render(<Counter />, document.getElementById('root'))
 