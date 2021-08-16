import React from './react';
import ReactDOM from './react-dom';

class TextInput extends React.Component {
	constructor(props) {
		super(props);
		this.inputRef = React.createRef();
	}

	getFocus = () => {
		this.inputRef.current.focus()
	}

	render() {
		return (
			<input ref={this.inputRef}/>
		)
	}
}
class Form extends React.Component {
	constructor(props) {
		super(props);
		this.textInputRef = React.createRef();
		
	}

	// 当TextInput为类组件的时候，this.textInputRef.current指向的是组件的实例，所以可以直接调用实例上面的方法
	getInputFocus = () => {
		this.textInputRef.current.getFocus();	
	}

	render() {
		return(
			<div>
				<TextInput ref={this.textInputRef}/>
				<button onClick={this.getInputFocus}>获取焦点</button>
			</div>
		)
	}
}
ReactDOM.render(<Form />, document.getElementById('root'))