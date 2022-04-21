# Changelog

## [5.1.0] - 2022-04-21

### Changed

- Added check for useLayoutEffect to disable it on ssr

## [5.0.0] - 2022-02-06

### Added

- Added provider component`MatchMediaBreakpoints`
- Added consumer component`MatchBreakpoint`
- Added standalone component `MatchMediaQuery`

### Changed

**BREAKING CHANGES**

- Always triggers breakpoint detection if a new object reference is passed for `breakpoints`
- Remove property `windowWidth` from `BreakpointsProps`, since it triggers unnecessary re-renders
- Default export is now `MatchMediaBreakpoints`, the previous component is available as `WindowSizeBreakpoints`

### Removed

- Removed property `detectBreakpointsObjectChanges` in `ReactBreakpointsProps`

## [4.0.2] - 2022-01-31

### Fixed

- Fixed compatibility with ES5 browsers (object destructuring support)

## [4.0.1] - 2022-01-29

### Fixed

- Fixed path to repo in package.json

## [4.0.0] - 2022-01-28

### Added

- Added hook `useBreakpoints`

### Changed

- Convert to typescript
- Refactor to use function components and hooks
- `ReactBreakpoints` does not trigger re-renders when the `breakpoints` object changes by default

### Removed

- Removed undocumented `snapMode` property
