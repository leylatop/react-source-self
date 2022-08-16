import React from './react/index'
import ReactDOM from './react-dom/index'

const h1 = <h1 className='hello-h1' style={{ color: 'red' }}> hello</h1>
console.log(h1);
ReactDOM.render(h1, document.getElementById('root'))