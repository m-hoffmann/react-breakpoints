import React from 'react'

const BreakpointsContext = React.createContext()

const { Provider, Consumer } = BreakpointsContext

BreakpointsContext.displayName = 'ReactBreakpoints'

export { Provider, Consumer }
export default BreakpointsContext
