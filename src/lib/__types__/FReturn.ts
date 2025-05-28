/**
 * Generic return type wrapper, for when a function can return either a value or an error.
 *
 * if the function returns an **error** the value will be
 * ```ts
 * {
 *  value: null;
 *  error: {
 *   message: string;
 *   code: number;
 * };
 * ```
 *
 * if the function is successful the value will be
 * ```ts
 * {
 *  value: T;
 *  error: null;
 * };
 * ```
 *
 * @template T - The type of value returned on success.
 */
export type FReturn<T> =
  | {
      value: null;
      error: {
        message: string;
        code: number | string;
      };
    }
  | {
      value: T;
      error: null;
    };
