import createElement from './createElement'
import createRef from './createRef'
import Component from './Component'
import forwardRef from './forwardRef'
import { REACT_FRAGMENT } from './constants'
import { createContext } from './createContext'
import { cloneElement } from './cloneElement'
import { PureComponent } from './PureComponent'
import memo from './memo'
import * as hook from './hook'


const React ={
  createElement,
  createRef,
  forwardRef,
  Component,
  createContext,
  Fragment: REACT_FRAGMENT,
  cloneElement,
  PureComponent,
  memo,
  ...hook
}

export default React