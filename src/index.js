import React from './react/index'
import ReactDOM from './react-dom/index'

// import React from 'react'
// import ReactDOM from 'react-dom'
class UserName extends React.Component {
  input = React.createRef()
  focus = () => {
    this.input.current.focus()
  }
  render() {
    return <input ref={this.input} onClick={this.focus}></input>
  }
}
class ClassComponent extends React.Component {
  usernameRef = React.createRef()
  focus = (event) => {
    this.usernameRef.current.focus()
  }

  render() {
    return (
      <div>
        <UserName ref={this.usernameRef}/>
        <button onClick={this.focus}>计算</button>
      </div>
    )
  }
}

const ele = <ClassComponent name="xiaoqiao" title="hhh"><span>这是类组件的儿子</span><span>这是类组件的儿子2</span></ClassComponent>
console.log(ele)
ReactDOM.render(ele, document.getElementById('root'))