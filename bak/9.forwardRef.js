import React from './react';
import ReactDOM from './react-dom';

// 经过ref转发之后的函数组件，会多一个ref参数
function TextInput(props, ref) {
	return (
		<input ref={ref}/>
	)
}
const ForwardedTextInput = React.forwardRef(TextInput);	// ref转发后，变成了一个类组件
class Form extends React.Component {
	constructor(props) {
		super(props);
		this.textInputRef = React.createRef();
		
	}

	// 当TextInput为函数组件，this.textInputRef.current 指向的是函数组件内部真实dom，所以可以直接调用原生dom方法
	getInputFocus = () => {
		this.textInputRef.current.focus();
	}

	render() {
		return(
			<div>
				<ForwardedTextInput ref={this.textInputRef}/>
				<button onClick={this.getInputFocus}>获取焦点</button>
			</div>
		)
	}
}
ReactDOM.render(<Form />, document.getElementById('root'))