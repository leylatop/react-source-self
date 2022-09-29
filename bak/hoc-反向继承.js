import React, { Component } from 'react'
import ReactDOM from 'react-dom'

// 反向继承： 先走子类，再走父类
// 场景：在不改变原有组件的情况下，继承老组件，实现自己的功能
// 假如Button 是别人写的，不能直接改源码
class Button extends React.Component {
  state = { name: 'Button' }
  componentDidMount () {
    console.log('Button componentDidMount')
  }

  componentWillMount () {
    console.log('Button componentWillMount')
  }
  render() {
    console.log('Button render')
    return <button title={this.props.title} />
  }
}

export const countWrapper = OldComponent => {
  return class NewButton extends OldComponent {
    state = { number: 0  }
    componentDidMount () {
      console.log('NewButton componentDidMount')
      super.componentDidMount()
    }
  
    componentWillMount () {
      console.log('NewButton componentWillMount')
      super.componentWillMount()
    }

    handleClick = () => {
      this.setState({
        number: this.state.number + 1
      })
    }

    render () {
      console.log('NewButton render')

      const element = super.render()
      let newProps = {
        ...element.props,
        onClick: this.handleClick
      }
      return React.cloneElement(element, newProps, this.state.number)
    }
  }
}

const CounterButton = countWrapper(Button)
ReactDOM.render(<CounterButton />, document.getElementById('root'))