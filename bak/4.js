import React from './react';
import ReactDOM from './react-dom';

let position = {};	
class Counter extends React.Component {
	state = {
		number: 0
	}
	
	componentDidMount() {
		// 在没有更新state和props的值的前提下可以使用forceUpdate更新组件
		document.addEventListener('mousemove', (event) => {
			position.x = event.pageX;
			position.y = event.pageY;
			this.forceUpdate();
		})
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
			<div>
				<p>x: {position.x} y: {position.y}</p>
				<p>{this.state.number}</p>
				<button onClick={this.handleClick}>增加</button>
			</div>
		)
	}
}
ReactDOM.render(<Counter />, document.getElementById('root'))
 