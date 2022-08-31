import React from './react/index'
import ReactDOM from './react-dom/index'

// import React from 'react'
// import ReactDOM from 'react-dom'

// Function components cannot be given refs. 
// Attempts to access this ref will fail. 
// Did you mean to use React.forwardRef()
function UserName(props, ref) {
  // 如果不想把节点暴露给父组件，避免父组件对节点进行胡乱操作，就创建一个空的ref，然后将真实的ref部分方法暴露给父组件
  // const inputRef = React.createRef()
  // const focus = () => {
  //   inputRef.current.focus()
  // }
  // ref.current =  { focus }
  // return <input ref={inputRef} />

  const focus = () => {
    ref.current.focus()
  }
  console.log('---ref', ref)
  return <input ref={ref} onClick={focus}></input>
}

const ForwardUserName = React.forwardRef(UserName)

class ClassComponent extends React.Component {
  usernameRef = React.createRef()
  focus = (event) => {
    this.usernameRef.current.focus()
    // this.usernameRef.current.remove()
  }

  render() {
    console.log(<ForwardUserName ref={this.usernameRef}/>)
    return (
      <div>
        <ForwardUserName ref={this.usernameRef}/>
        <button onClick={this.focus}>计算</button>
      </div>
    )
  }
}

const ele = <ClassComponent name="xiaoqiao" title="hhh"><span>这是类组件的儿子</span><span>这是类组件的儿子2</span></ClassComponent>
console.log(ele)
ReactDOM.render(ele, document.getElementById('root'))

