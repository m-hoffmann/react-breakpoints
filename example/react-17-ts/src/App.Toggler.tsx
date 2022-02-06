import { useState } from 'react';

import App from './App';
import AppMatchMediaBreakpoints from './App.MatchMediaBreakpoints';
import AppWindowSizeBreakpoints from './App.WindowSizeBreakpoints';
import AppMatchMediaQuery from './App.MatchMediaQuery';

enum Provider {
  MatchMediaBreakpoints = 'MatchMediaBreakpoints',
  WindowSizeBreakpoints = 'WindowSizeBreakpoints',
  MatchMediaQuery = 'MatchMediaQuery',
}

export default function AppToggler() {
  const [provider, setProvider] = useState<Provider>(
    Provider.MatchMediaBreakpoints,
  );

  return (
    <App title={'react-hook-break-points'}>
      <div className="AppProvider">
        <button
          className={
            provider === Provider.MatchMediaBreakpoints ? 'active' : ''
          }
          type="button"
          onClick={() => setProvider(Provider.MatchMediaBreakpoints)}
        >
          {Provider.MatchMediaBreakpoints}
        </button>

        <button
          className={
            provider === Provider.WindowSizeBreakpoints ? 'active' : ''
          }
          type="button"
          onClick={() => setProvider(Provider.WindowSizeBreakpoints)}
        >
          {Provider.WindowSizeBreakpoints}
        </button>

        <button
          className={provider === Provider.MatchMediaQuery ? 'active' : ''}
          type="button"
          onClick={() => setProvider(Provider.MatchMediaQuery)}
        >
          {Provider.MatchMediaQuery}
        </button>
      </div>
      {provider === Provider.MatchMediaBreakpoints ? (
        <AppMatchMediaBreakpoints />
      ) : provider === Provider.WindowSizeBreakpoints ? (
        <AppWindowSizeBreakpoints />
      ) : (
        <AppMatchMediaQuery />
      )}
    </App>
  );
}
