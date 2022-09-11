import createElement from './createElement'
import createRef from './createRef'
import Component from './Component'
import forwardRef from './forwardRef'
import { REACT_FRAGMENT } from './constants'


const React ={
  createElement,
  createRef,
  forwardRef,
  Component,
  Fragment: REACT_FRAGMENT
}

export default React