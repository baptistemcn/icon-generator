import { type ComponentPropsWithRef } from "react";

export function FormGroup(props: ComponentPropsWithRef<"div">) {
  const { children } = props;
  return <div className="flex flex-col gap-1">{children}</div>;
}
