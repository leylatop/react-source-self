import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<h1>hello</h1>, document.getElementById('root'))

function deepFreeze(obj) {
    Object.freeze(obj);
    for(let key in obj) {
        if(typeof obj[key] == 'object') {
            deepFreeze(obj[key])
        }
    }
}