import React, { Component } from 'react'
// export default class CrashComponent extends Component {
function CrashPage(Component, {
    onError,
}) {
    return class Page extends Component {
        constructor(props) {
            super(props);
            this.state = {
                currentError: null
            }
        }

        static getDerivedStateFromError(error) {
            return {
                currentError: error
            }
        }

        componentDidCrash(error, errorInfo) {
            onError(error)
        }

        render() {
            const {currentError} = this.state;
            if(currentError) {
                return <CrashComponent />
            } else {
                return <Component { ...this.props } />
            }
        }
    }
}
// class 
class CrashComponent extends Component {
    render() {
        return (
            <div>
                您的页面已崩溃
            </div>
        )
    }
}


export default CrashPage