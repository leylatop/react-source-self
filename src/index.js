import React from './react/index'
import ReactDOM from './react-dom/index'
class ClassComponent extends React.Component {
  render () {
    const {name} = this.props
    return <h1 className='hello-h1' style={{ color: 'red' }}> {name}</h1>
  }
}

const ele = <ClassComponent name="xiaoqiao" title="hhh"><span>这是类组件的儿子</span><span>这是类组件的儿子2</span></ClassComponent>
console.log(ele)
ReactDOM.render(ele, document.getElementById('root'))