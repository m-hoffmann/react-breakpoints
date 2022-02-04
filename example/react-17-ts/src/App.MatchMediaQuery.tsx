import { MatchMediaQuery } from 'react-hook-breakpoints';

export default function MatchMediaQueryExample(): JSX.Element {
  return (
    <div>
      <h2 className="App-title">
        Standalone component that window.matchMedia to detect breakpoints
      </h2>

      <MatchMediaQuery query="screen and (min-width: 800px)">
        <h1>MatchMediaQuery</h1>
        <div>Visible for screens larger 800px</div>
      </MatchMediaQuery>

      <MatchMediaQuery query="(max-width: 800px)">
        <h1>MatchMediaQuery</h1>
        <div>Visible for screens smaller than 800px</div>
      </MatchMediaQuery>

      <MatchMediaQuery query="(min-width: 600px) and (max-width: 800px)">
        <h1>MatchMediaQuery</h1>
        <div>Visible between 600px and 800px</div>
      </MatchMediaQuery>

      <MatchMediaQuery query="print">
        <div>Only rendered in print</div>
      </MatchMediaQuery>
    </div>
  );
}
