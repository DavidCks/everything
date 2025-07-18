/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObservablePrimitive } from "@legendapp/state";
import { PropertyWhere } from "../__types__/PropertyWhere";

export function controllerRaw<T extends Record<string, any>>(target: T) {
  return {
    raw<K extends PropertyWhere<T, ObservablePrimitive<any>>>(key: K): T[K] {
      return target[key] as T[K];
    },
  };
}
