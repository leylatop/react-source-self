import React from './react/index'
import ReactDOM from './react-dom/index'

// import React, { createRef } from 'react'
// import * as ReactDOM from 'react-dom';
class Dialog extends React.Component {
  constructor() {
    super()
    this.node = document.createElement('div')
    document.body.appendChild(this.node)
  }

  componentWillUnmount() {
    document.body.remove(this.node)
  }

  render() {
    return ReactDOM.createPortal(
    <div className='dialog'>模态框</div>,
    this.node
    )
  }
}
class App extends React.Component {
  render () {
    return (
      <div>
        <Dialog />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
