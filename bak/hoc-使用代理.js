import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const loading = message => OldComponent => {
  return class extends React.Component {
    render () {
      const state = {
        show() {
          console.log('show', message)
        },
        hide() {
          console.log('hide', message)
        }
      }
      return <OldComponent {...this.props} {...state}/>
    }
  }
}
export default class Counter extends Component {
  render() {
    return (
      <>
        <div>Counter</div>
        <button onClick={this.props.show}>show</button>
        <button onClick={this.props.hide}>hide</button>
      </>
    )
  }
}
const LoadingCount = loading('消息')(Counter)
ReactDOM.render(<LoadingCount />, document.getElementById('root'))