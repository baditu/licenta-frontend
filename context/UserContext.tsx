import {
  createContext,
  Dispatch,
  useContext,
  useMemo,
  useReducer,
} from "react";

import { initialState, UserReducer, UserState } from "./UserReducer";

export type UserContext = {
  state: UserState;
  dispatch: Dispatch<any>;
};

const userContext = createContext<UserContext>({
  state: initialState,
  dispatch: () => {},
});

export function UserContextWrapper({ children }: { children: any }) {
  const [state, dispatch] = useReducer(UserReducer, initialState);

  const contextValue: { state: UserState; dispatch: Dispatch<any> } =
    useMemo(() => {
      return { state, dispatch };
    }, [state, dispatch]);

  return (
    <userContext.Provider value={contextValue}>{children}</userContext.Provider>
  );
}

export function useUserContext() {
  return useContext<UserContext>(userContext);
}
