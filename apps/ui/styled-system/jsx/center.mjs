import { createElement, forwardRef } from 'react'

import { splitProps } from '../helpers.mjs';
import { getCenterStyle } from '../patterns/center.mjs';
import { styled } from './factory.mjs';

export const Center = /* @__PURE__ */ forwardRef(function Center(props, ref) {
  const [patternProps, restProps] = splitProps(props, ["inline"])

const styleProps = getCenterStyle(patternProps)
const mergedProps = { ref, ...restProps, css: styleProps }

return createElement(styled.div, mergedProps)
  })