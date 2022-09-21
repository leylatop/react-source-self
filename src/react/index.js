import createElement from './createElement'
import createRef from './createRef'
import Component from './Component'
import forwardRef from './forwardRef'
import { REACT_FRAGMENT } from './constants'
import { createContext } from './createContext'


const React ={
  createElement,
  createRef,
  forwardRef,
  Component,
  createContext,
  Fragment: REACT_FRAGMENT
}

export default React