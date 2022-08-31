import { REACT_FORWORD_REF } from "./constants";

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWORD_REF,
    render
  }
}

export default forwardRef