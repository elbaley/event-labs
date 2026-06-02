import { Provider } from "react-redux";
import { store } from "@/store/store";
import { PropsWithChildren } from "react";
import { AuthHydrator } from "./auth-hydrator";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  );
}
