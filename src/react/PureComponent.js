import Component from "./Component"
import { shallowEqual } from "./utils"

export class PureComponent extends Component {
  // 如果再业务组件中重写了 shouldComponentUpdate，这里的 shouldComponentUpdate 就会失效
  shouldComponentUpdate (newProps, nextState) {
    // 不相等才update
    return !shallowEqual(this.props, newProps) || !shallowEqual(this.state, nextState)
  }
}