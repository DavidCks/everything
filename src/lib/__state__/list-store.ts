import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ListStore<T> = {
  value: T[];
  setValue: (items: T[]) => void;
  addValue: (item: T) => void;
  removeValue: (predicate: (item: T) => boolean) => void;
};

/**
 * Creates a persistent Zustand store for a generic list.
 * @param key Unique key to store the list under in localStorage
 * @returns Zustand store hook
 */
export function createListStore<T>(key: string) {
  return create<ListStore<T>>()(
    persist(
      (set) => ({
        value: [],
        setValue: (items) => set({ value: items }),
        addValue: (item) => set((state) => ({ value: [...state.value, item] })),
        removeValue: (predicate) =>
          set((state) => ({
            value: state.value.filter((item) => !predicate(item)),
          })),
      }),
      {
        name: key,
      }
    )
  );
}
