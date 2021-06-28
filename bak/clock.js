import React from 'react';
import ReactDOM from 'react-dom';


class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state ={
			date: new Date(),
		}
	}
	// 组件挂载完成
	componentDidMount() {
		this.timer = setInterval(this.tick, 1000)
	}
	// 组件销毁
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	// 类的属性，函数中的this永远指向组件实例
	tick = () => {
		this.setState({
			date: new Date()
		})
	}

	render() {
		return (
			<div>
				<h1>hello world</h1>
				<h1>现在时间是 {this.state.date.toLocaleTimeString()}</h1>
			</div>
		)
	}
}
ReactDOM.render(<Clock />, document.getElementById('root'))