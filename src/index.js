import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
	state = {
		number: 0
	}
	
	handleClick = (event) => {
		console.log(event)
		this.setState({number: this.state.number + 1})
		console.log('handleClick', this.state.number);	// 0
		this.setState({number: this.state.number + 1})
		console.log('handleClick', this.state.number);	// 0
		setTimeout(() => {
			this.setState({number: this.state.number + 1})
			console.log('handleClick', this.state.number);	// 2
			this.setState({number: this.state.number + 1})
			console.log('handleClick', this.state.number);	// 3
		});
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
 