import React from './react/index'
import ReactDOM from './react-dom/index'

// import React from 'react'
// import ReactDOM from 'react-dom'

class ClassComponent extends React.Component {
   state = {
    number: 0
  }

  addCounter = () => {
    this.setState({
      number: this.state.number + 1
    })
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.addCounter}>add</button>
      </div>
    )
  }
}

const ele = <ClassComponent name="xiaoqiao" title="hhh"><span>这是类组件的儿子</span><span>这是类组件的儿子2</span></ClassComponent>
console.log(ele)
ReactDOM.render(ele, document.getElementById('root'))