export class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance
    this.pendingStates = []
  }

  addState = (pendingState) => {
    this.pendingStates.push(pendingState)
    this.emitUpdate()
  }

  emitUpdate = () => {
    this.updateComponent()
  }

  updateComponent = () => {
    const { classInstance, pendingStates } = this
    if(pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState())
    }
  }

  getState = () => {
    const { classInstance, pendingStates } = this
    let { state } = classInstance 
    pendingStates.forEach(pendingState => {
      state = { ...state, ...pendingState }
    })
    pendingStates.length = 0
    return state
  }
}

function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState
  classInstance.forceUpdate()
}

