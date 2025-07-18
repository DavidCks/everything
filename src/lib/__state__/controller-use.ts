/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObservablePrimitive } from "@legendapp/state";
import { PropertyWhere } from "../__types__/PropertyWhere";
import { UnwrapObservable } from "../__types__/UnwrapObservable";
import { use$ } from "@legendapp/state/react";

export function controllerUse<T extends Record<string, any>>(target: T) {
  return {
    use<K extends PropertyWhere<T, ObservablePrimitive<any>>>(
      key: K,
    ): UnwrapObservable<T[K]> {
      return use$(target[key]) as UnwrapObservable<T[K]>;
    },
  };
}
