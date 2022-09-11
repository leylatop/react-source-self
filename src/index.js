import React from './react/index'
import ReactDOM from './react-dom/index'

// import React from 'react'
// import ReactDOM from 'react-dom'

class Counter extends React.Component {
	state = {
    list: ['A', 'B',  'C', 'D', 'E', 'F']
  }

	handleClick = () => {
		this.setState({ list: ['A', 'C', 'E', 'B', 'G'] })
	}

	render() {
    const { list } = this.state
		return (
			<React.Fragment>
        <ul>{ list.map((i) => <li key={i}>{i}</li>)}</ul>
				<button onClick={this.handleClick}>add</button>
			</React.Fragment>
		)
	}
}

ReactDOM.render(<Counter />, document.getElementById('root'))

