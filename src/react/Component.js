import { Updater } from './Updater'

export default class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    // 每个类组件的实例都有一个updater更新器负责更新调度
    // Component不关心更新调度，只管更新组件，更新调度由updater负责，将component的实例传过去，在updater中实现更新
    this.updater = new Updater(this);
  }

  setState = (pendingState) => {
    this.updater.addState(pendingState)
  }

  forceUpdate = () => {
    console.log('forceUpdate', this.state)
  }
}
