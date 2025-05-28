import { AuthChangeEvent, Session } from "@supabase/supabase-js";

type Listener = (event: AuthChangeEvent, session: Session | null) => void;

const listeners = new Set<Listener>();

export const authEvents = {
  on(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  emit(event: AuthChangeEvent, session: Session | null) {
    listeners.forEach((l) => l(event, session));
  },
};
