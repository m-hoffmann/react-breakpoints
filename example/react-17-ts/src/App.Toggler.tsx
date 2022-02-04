import { useState } from 'react';

import App from './App';
import AppMatchMediaBreakpoints from './App.MatchMediaBreakpoints';
import AppReactBreakpoints from './App.ReactBreakpoints';
import AppMatchMediaQuery from './App.MatchMediaQuery';

type Provider =
  | 'MatchMediaBreakpoints'
  | 'ReactBreakpoints'
  | 'MatchMediaQuery';

export default function AppToggler() {
  const [provider, setProvider] = useState<Provider>('MatchMediaBreakpoints');
  return (
    <App title={'react-hook-break-points'}>
      <div className="AppProvider">
        <button
          className={provider === 'MatchMediaBreakpoints' ? 'active' : ''}
          type="button"
          onClick={() => setProvider('MatchMediaBreakpoints')}
        >
          MatchMediaBreakpoints
        </button>

        <button
          className={provider === 'ReactBreakpoints' ? 'active' : ''}
          type="button"
          onClick={() => setProvider('ReactBreakpoints')}
        >
          ReactBreakpoints
        </button>

        <button
          className={provider === 'MatchMediaQuery' ? 'active' : ''}
          type="button"
          onClick={() => setProvider('MatchMediaQuery')}
        >
          MatchMediaQuery
        </button>
      </div>
      {provider === 'MatchMediaBreakpoints' ? (
        <AppMatchMediaBreakpoints />
      ) : provider === 'ReactBreakpoints' ? (
        <AppReactBreakpoints />
      ) : (
        <AppMatchMediaQuery />
      )}
    </App>
  );
}
