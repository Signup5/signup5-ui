import {DispatchAction, InitialState, rootReducer} from "./Reducers/rootReducer";
import {compose, createStore} from "redux";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore<InitialState, DispatchAction, any, any>(
  rootReducer,
  composeEnhancers()
);