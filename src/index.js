import React from './react';
import ReactDOM from 'react-dom';

// let element = (
//     <div className="title" style={{color: 'red'}}>
//         <span>hello </span> world
//     </div>
// )
// 经过babel转化之后，会转化成下面的代码
// let element = React.createElement('div', {
//     className: 'title',
//     style: {
//         color: 'red'
//     }
// }, React.createElement('span', null, 'hello'), 'world')

function componentFunction(props) {
	return React.createElement('h1', null, React.createElement('span',null, 'hello,'), props.name)
}
let element = React.createElement(componentFunction, {name: 'xiaoqiao'})
// {
//     "type": "div",
//     "key": null,
//     "ref": null,
//     "props": {
//       "className": "title",
//       "style": {
//         "color": "red"
//       },
//       "children": [
//         {
//           "type": "span",
//           "key": null,
//           "ref": null,
//           "props": {
//             "children": "hello "
//           },
//           "_owner": null,
//           "_store": {}
//         },
//         " world"
//       ]
//     },
// }
ReactDOM.render(element, document.getElementById('root'))