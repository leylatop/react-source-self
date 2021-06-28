import React from './react';
import ReactDOM from './react-dom';


class Counter extends React.Component {

	state = {
		number: 0
	}

	// 如何判断是同步还是异步，是不是批量
	// react能管控的地方（事件处理函数，生命周期函数），更新就是异步的；凡是react不能管控的地方（setInterval, setTimeout，原生的dom事件，Promise.resolve().then(()=> {})），就是非批量的
	handleClick = (event) => {
		// 在事件处理函数中，setState的调用会批量执行；setState并不会修改this.state，所以每次this.state的值都是原来的值，等事件结束后，再进行更新
		this.setState({
			number: this.state.number + 1
		})
		console.log(this.state.number);	// 0
		this.setState({
			number: this.state.number + 1
		})
		console.log(this.state.number); // 0
		// 此时事件处理函数这个宏任务已经完成，会计算最新的state，state的值是1
		
		// 在react管控不到的地方，是同步执行的（这是一个想要实现同步更新的方法）
		setTimeout(() => {
			this.setState({
				number: this.state.number + 1
			})
			console.log(this.state.number);	// 2
			this.setState({
				number: this.state.number + 1
			})
			console.log(this.state.number); // 3
		})
	}
	render() {
		return (
			<div>
				<p>{this.state.number}</p>
				<button onClick={this.handleClick}>增加</button>
			</div>
		)
	}
}
ReactDOM.render(<Counter />, document.getElementById('root'))
