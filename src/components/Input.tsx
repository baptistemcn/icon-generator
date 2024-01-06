import { type ComponentPropsWithRef } from "react";

export function Input(props: ComponentPropsWithRef<"input">) {
  return <input className={"rounded border border-gray-800"} {...props} />;
}
