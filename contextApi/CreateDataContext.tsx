"use client";
import React, { createContext, useReducer } from "react";
import {
  authReducerType,
  boundAction,
  boundActionType,
  contextActionType,
  stateType,
  initialBoundActions,
} from "./AuthContext";

type DataContextType = (
  reducer: authReducerType,
  actions: contextActionType,
  initialState: stateType
) => {
  Context: any;
  Provider: any;
};
export type contextType = { state: stateType; boundActions: boundActionType };
// this is the base architecture of the context api
const DataContext: DataContextType = (reducer, actions, initialState) => {
  const Context = createContext<contextType | null>(null);
  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const boundActions: boundActionType = { ...initialBoundActions };

    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }
    return (
      <Context.Provider value={{ state, boundActions }}>
        {children}
      </Context.Provider>
    );
  };
  return { Context, Provider };
};

export default DataContext;
 