import { render, screen } from '@testing-library/react';
import App from './App.MatchMediaBreakpoints';

describe('MatchMediaBreakpoints', () => {
  test('Displays the app without crashing', () => {
    render(<App />);
    const elements = screen.queryAllByText(/Your current breakpoint is/i);
    expect(elements.length).toBe(3);
  });
});
