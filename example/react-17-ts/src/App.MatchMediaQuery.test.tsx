import { render, screen } from '@testing-library/react';
import App from './App.MatchMediaQuery';

describe('MatchMediaQuery', () => {
  test('Displays the app without crashing', () => {
    render(<App />);
    const element = screen.getByText(/Standalone component/i);
    expect(element).toBeInTheDocument();
  });
});
