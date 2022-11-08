import React from './react/index'
import ReactDOM from './react-dom/index'

// import React, { createRef } from 'react'
// import * as ReactDOM from 'react-dom';
class ClassComponent extends React.PureComponent {
  render() {
    console.log('ClassComponent render')

    return (
      <div>ClassComponent {this.props.number}</div>
    )
  }
}

function FunctionComponent (props) {
  console.log('FunctionComponent render')
  return (
    <div>FunctionComponent {props.number}</div>
  )
}

const MemoFunctionComponent = React.memo(FunctionComponent)
class ParentComponent extends React.Component {
  state = { number: 0 }
  inputRef = React.createRef()

  handleClickAdd = () => {
    this.setState({number: parseInt(this.inputRef.current.value) + this.state.number })
  }
  render () {
    return (
      <div>
        <ClassComponent number={this.state.number}/>
        <MemoFunctionComponent number={this.state.number}/>
        <input ref={this.inputRef}/>
        <button onClick={this.handleClickAdd}>相加</button>
      </div>
    )
  }
}

ReactDOM.render(<ParentComponent />, document.getElementById('root'))
