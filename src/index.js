import React from './react/index'
import ReactDOM from './react-dom/index'
const FunctionComponent = (props) => {
  console.log(props)
  const { name} = props
  return <h1 className='hello-h1' style={{ color: 'red' }}> {name}</h1>
}

const ele = <FunctionComponent name="xiaoqiao" title="hhh"/>
console.log(ele)
ReactDOM.render(ele, document.getElementById('root'))