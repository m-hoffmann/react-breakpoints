import React from 'react'
import createReactContext from 'create-react-context'

const BreakpointsContext = React.createContext
  ? React.createContext()
  : createReactContext()

const { Provider, Consumer } = BreakpointsContext

BreakpointsContext.displayName = "ReactBreakpoints";

export { Provider, Consumer }
export default BreakpointsContext
