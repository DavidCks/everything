// useAuthEffect.ts
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { authEvents } from "../authEvents";

export function useAuthEffect(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  useEffect(() => {
    callback("INITIAL_SESSION", null);
    const unsubscribe = authEvents.on(callback);
    return () => {
      unsubscribe();
    };
  }, [callback]);
}
