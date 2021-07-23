import React from './react';
import ReactDOM from './react-dom';

class Sum extends React.Component {

	constructor(props) {
		super(props);
		this.numberA = React.createRef();
		this.numberB = React.createRef();
		this.result = React.createRef();
	}

	handleClick = () => {
		let numberA = this.numberA.current.value;
		let numberB = this.numberB.current.value;
		this.result.current.value = parseFloat(numberA) + parseFloat(numberB)
	}

	render() {
		return(
			<>
				<input ref={this.numberA} />
				<input ref={this.numberB} />
				<button onClick={this.handleClick}>+</button>
				<input ref={this.result} />
			</>
		)
	}
}

ReactDOM.render(<Sum />, document.getElementById('root'))
 