import { REACT_FORWARD_REF } from "./constants";

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render
  }
}

export default forwardRef