import React, {createContext, useContext} from "react";
import {useColorScheme} from "react-native";

type StyleType = "dark" | "light";

interface AppStyle {
  textColor: string;
  invertedTextColor: string;
  backgroundColor: string;
  backgroundColorAlpha: string;
  accentColor: string;
}

const dark: AppStyle = {
  textColor: "#FFFFFF",
  invertedTextColor: "#000000",
  backgroundColor: "#000000",
  backgroundColorAlpha: "#1C1C1EAA",
  accentColor: "#0A84FF",
};

const light: AppStyle = {
  textColor: "#000000",
  invertedTextColor: "#FFFFFF",
  backgroundColor: "#F2F2F7",
  backgroundColorAlpha: "#F2F2F7AA",
  accentColor: "#0A84FF",
};

interface AppStyleContext {
  type: StyleType;
  style: AppStyle;
}

const Context = createContext<AppStyleContext>({
  style: dark,
  type: "dark",
});

interface Props {
  children?: React.ReactNode;
}

export default function AppStyleProvider({children}: Props) {
  const scheme = useColorScheme();
  const type: StyleType = scheme === "light" ? "light" : "dark";
  const style = type === "dark" ? dark : light;
  const value: AppStyleContext = {
    type,
    style,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppStyle() {
  return useContext(Context);
}
