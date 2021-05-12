import React from 'react';
import ReactDOM from 'react-dom';

// jsx在执行的时候其实是一个函数调用，它是一个创建元素的工厂函数
// let element = React.createElement('h1')

let element = <h1>hello</h1>;
console.log(element)
console.log(JSON.stringify(element, null, 2));
// {
//     "type": "h1",       // 元素的类型
//     "key": null,        // 区分同一个父亲的不同儿子的 dom-diff
//     "ref": null,        // 获取真实节点
//     "props": {          // 属性 
//       "children": "hello"
//     },
//     "_owner": null,     // 先不管
//     "_store": {}        // 先不管
// }
ReactDOM.render(<h1>hello</h1>, document.getElementById('root'))