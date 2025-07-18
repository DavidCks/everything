/* eslint-disable @typescript-eslint/no-explicit-any */
import { controllerRaw } from "./controller-raw";
import { controllerUse } from "./controller-use";

export function withControllerHelpers<T extends Record<string, any>>(
  controller: T,
) {
  return Object.assign(controller, {
    ...controllerUse(controller),
    ...controllerRaw(controller),
  });
}
