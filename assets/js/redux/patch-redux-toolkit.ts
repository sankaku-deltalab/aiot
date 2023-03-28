/**
 * https://gist.github.com/romgrk/bb16d7b8d3827481d04eb535e8d1bc74
 */
import {AnyAction, PayloadAction, Slice} from '@reduxjs/toolkit';

/* The redux-toolkit maintainers refuse to add a way to disable immer.js for
 * specific reducers, therefore we need to create an escape hatch by ourselves.
 * Immer.js needs to be disabled in certain cases for performance reasons.
 * Link: https://github.com/reduxjs/redux-toolkit/issues/242
 */

/** Add reducers without immer.js to a redux-toolkit slice */
export function addRawReducers<S>(
  slice: Slice<S>,
  reducers: Record<string, (state: S, action: PayloadAction<any>) => S>
) {
  const originalReducer = slice.reducer;
  const actionMap = Object.fromEntries(Object.entries(reducers).map(([name, fn]) => [`${slice.name}/${name}`, fn]));

  slice.reducer = (state: S | undefined, action: AnyAction) => {
    const fn = actionMap[action.type];
    if (fn) return fn(state!, action as PayloadAction<any>);
    return originalReducer(state, action);
  };

  const actionCreators = Object.fromEntries(
    Object.entries(reducers).map(([name]) => [name, (payload: any) => ({type: `${slice.name}/${name}`, payload})])
  );

  return actionCreators;
}
