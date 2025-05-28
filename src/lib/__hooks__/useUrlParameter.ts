import { useEffect, useState } from "react";

/**
 * Custom hook that reads a query parameter from the URL
 * and updates if it changes.
 *
 * @param {string} name - The query parameter name to extract.
 * @returns {string | undefined} The value from the query string, if any.
 */
function useUrlParameter(name: string): string | undefined {
  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const param = urlParams.get(name);
      setValue(param ?? undefined);
    };

    // Run initially
    handleChange();

    // Re-run on URL changes (for Next.js App Router)
    window.addEventListener("popstate", handleChange);
    window.addEventListener("pushstate", handleChange);
    window.addEventListener("replacestate", handleChange);

    return () => {
      window.removeEventListener("popstate", handleChange);
      window.removeEventListener("pushstate", handleChange);
      window.removeEventListener("replacestate", handleChange);
    };
  }, [name]);

  return value;
}

export default useUrlParameter;
