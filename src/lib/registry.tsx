"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
// @ts-ignore - This tells TypeScript to ignore the missing type file for this import
import { AppRegistry } from "react-native-web";

export default function ReactNativeRegistry({ children }: { children: React.ReactNode }) {
  const [styles] = useState(() => {
    AppRegistry.registerComponent("App", () => () => children);
    const { getStyleElement } = AppRegistry.getApplication("App");
    return getStyleElement();
  });

  useServerInsertedHTML(() => {
    return <>{styles}</>;
  });

  return <>{children}</>;
}
