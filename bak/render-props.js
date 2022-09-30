import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// render-props： 在组件之间使用一个值为函数的props共享代码的简单技术
// 功能逻辑和子组件拆分
class MouseTrack extends React.Component {
  state = { x: 0, y: 0 }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    })
  }
  render () {
    return (
      <div onMouseMove={this.handleMouseMove}>
        { this.props.render(this.state)}
      </div>
    )
  }
}

ReactDOM.render(<MouseTrack render={(props) => (
  <>
    <h1>移动鼠标</h1>
    <p>当前鼠标位置是（{props.x}， {props.y}）</p>
  </>
)}/>, document.getElementById('root'))


// render-props 也可以用hoc表达
function withTrack(OldComponent) {
  return class MouseTrack extends React.Component {
    state = { x: 0, y: 0 }
  
    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY,
      })
    }
    render () {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <OldComponent {...this.state}/>
        </div>
      )
    }
  }
}

function ChildrenComponent (props) {
  return (
    <>
      <h1>移动鼠标</h1>
      <p>当前鼠标位置是（{props.x}， {props.y}）</p>
    </>
  )
}
const WrapperComponent = withTrack(ChildrenComponent)

// ReactDOM.render(<WrapperComponent />, document.getElementById('root'))