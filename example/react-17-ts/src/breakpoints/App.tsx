import WithHOC from './WithHOC';
import WithRenderProps from './WithRenderProps';
import WithHook from './WithHook';
import WithMatchBreakpoint from './WithMatchBreakpoint';

export default function App() {
  return (
    <div>
      <WithHOC />
      <WithRenderProps />
      <WithHook />
      <WithMatchBreakpoint />
    </div>
  );
}
