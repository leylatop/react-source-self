import React from 'react';
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
// 函数组件
function ComponentFunction(props) {
	return React.createElement('h1', null, React.createElement('span',null, 'hello,'), props.name)
}
class ClassComponent extends React.Component {
	render() {
		return <div>类组件</div>
	}
}
// 类组件
let element1 = <ComponentFunction name="qiao"/>;
let element2 = <ClassComponent name="qiao"/>;
// let element2 = React.createElement(ClassComponent, {name: 'qiao'})


console.log(element1);
console.log(element2);
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
ReactDOM.render(element2, document.getElementById('root'))