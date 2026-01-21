"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { AppRegistry } from "react-native-web";

export default function ReactNativeRegistry({ children }: { children: React.ReactNode }) {
  const [styles] = useState(() => {
    AppRegistry.registerComponent("Main", () => () => null);
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication("Main");
    return getStyleElement();
  });

  useServerInsertedHTML(() => {
    return <>{styles}</>;
  });

  return <>{children}</>;
}
