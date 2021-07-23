import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from '../Dialog'

class Counter extends React.Component {
	queue = [
		{title: '标题1', content: '内容1'},
		{title: '标题2', content: '内容2'},
		{title: '标题3', content: '内容3'},
		{title: '标题4', content: '内容4'},
		{title: '标题5', content: '内容5'},
		{title: '标题6', content: '内容6'},
	];
	state = {
		content: '内容1',
		title: '弹窗1',
		showDialog: true,
	}
	
	buttonClick = () => {
		this.queue.shift();
		if(this.queue.length === 0) {
			this.setState({
				showDialog: false
			})
			return;
		}
		this.setState({
			content: this.queue[0].content,
			title: this.queue[0].title,
		});
	}

	render() {
		let {content, title, showDialog} = this.state;
		return (
			<Dialog isShow={showDialog} content={content} title={title} buttonClick={this.buttonClick} />
		)
	}
}

ReactDOM.render(<Counter />, document.getElementById('root'))
 