import React, { Component } from 'react'
import './index.css'
export default class Dialog extends Component {
    static defaultProps = {
        content: '',
        title: '',
        buttonText: 'next',
        isShow: false,
        buttonClick: function() {}
    }
    render() {
		let {content, title, buttonClick, isShow} = this.props
        
        return (
            <div className="dialog-container" style={{display: isShow ? 'block' : 'none'}}>
                <div className="dialog-shadow"></div>
                <div className="dialog-content">
                    <h1 className="title">{title}</h1>
                    <div className="content">{content}</div>
                    <div>
                        <button className="button" onClick={buttonClick}>下一个</button>
                    </div>
                </div>
            </div>
        )
    }
}
