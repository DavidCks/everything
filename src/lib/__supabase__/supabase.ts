import {
  createClient,
  Session,
  Subscription,
  SupabaseClient,
  User,
  WeakPassword,
} from "@supabase/supabase-js";
import { FReturn } from "../__types__/FReturn";
import { authEvents } from "./authEvents";

/**
 * Supabase class that provides a wrapper around the Supabase client.
 * You need to instantiate Supabase at least once before using it.
 *
 * It uses a singleton pattern, so after the first instantiation, it can be used statically.
 *
 * Handles authentication, session management, and user-related actions.
 */
export abstract class Supabase {
  private static _key: string;
  private static _url: string;

  /**
   * Supabase client instance.
   * @type {SupabaseClient}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static client: SupabaseClient<any, "public", any>;

  /**
   * Internal reference to the Supabase auth subscription.
   * Used to manage onAuthStateChange subscription lifecycle.
   * @type {Subscription | null}
   * @private
   */
  private static _authSubscription: Subscription | null = null;

  /**
   * List of custom auth state change listeners registered via `onAuthChange`.
   */
  private static _customAuthListeners: Array<
    (event: string, session: Session | null) => void
  > = [];

  /**
   * Get the current Supabase client instance.
   * @returns {SupabaseClient}
   */
  get client() {
    return Supabase.client;
  }

  /**
   * Get the current auth subscription.
   * @returns {Subscription | null}
   * @private
   */
  get _authSubscription(): typeof Supabase._authSubscription {
    return Supabase._authSubscription;
  }

  /**
   * Set the Supabase client instance.
   * @param {SupabaseClient} client - The Supabase client.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set client(client: SupabaseClient<any, "public", any>) {
    Supabase.client = client;
  }

  /**
   * Set the auth subscription.
   * @param {Subscription | null} subscription - Auth state change subscription.
   * @private
   */
  set _authSubscription(subscription: Subscription | null) {
    Supabase._authSubscription = subscription;
  }

  /**
   * Constructs a new instance of the Supabase wrapper and initializes the client.
   */
  constructor(key: string, url: string) {
    Supabase._key = key;
    Supabase._url = url;
    Supabase.ensureInitialized();
  }

  /**
   * Ensures the Supabase client is initialized before any operations are executed.
   * @private
   */
  static ensureInitialized(): void {
    if (!Supabase.client) {
      Supabase.client = createClient(Supabase._url, Supabase._key);
      Supabase._subscribeToAuthStateChange();
    }
  }

  /**
   * Registers a custom listener for Supabase auth state changes.
   *
   * @param {(event: string, session: Session | null) => void} listener
   * A function to be called on each auth state change.
   */
  static onAuthChange(
    listener: (event: string, session: Session | null) => void
  ): void {
    Supabase.ensureInitialized();

    if (typeof listener !== "function") return;

    Supabase._customAuthListeners.push(listener);
  }

  /**
   * Unregisters a previously registered auth change listener.
   *
   * @param {(event: string, session: Session | null) => void} listener
   * The same listener function that was passed to `onAuthChange`.
   */
  static offAuthChange(
    listener: (event: string, session: Session | null) => void
  ): void {
    Supabase._customAuthListeners = Supabase._customAuthListeners.filter(
      (fn) => fn !== listener
    );
  }

  private static _subscribeToAuthStateChange(): void {
    const { data } = Supabase.client.auth.onAuthStateChange(
      (event, session) => {
        console.log(event, session);

        // Default internal handling
        if (event === "INITIAL_SESSION") {
          // handle initial session
        } else if (event === "SIGNED_IN") {
          // handle sign in event
        } else if (event === "SIGNED_OUT") {
          // handle sign out event
        } else if (event === "PASSWORD_RECOVERY") {
          // handle password recovery event
        } else if (event === "TOKEN_REFRESHED") {
          // handle token refreshed event
        } else if (event === "USER_UPDATED") {
          // handle user updated event
        }

        // Custom registered handlers
        for (const listener of Supabase._customAuthListeners) {
          try {
            listener(event, session);
          } catch (e) {
            console.warn("Auth listener error:", e);
          }
        }
        authEvents.emit(event, session);
      }
    );

    Supabase._authSubscription = data.subscription;
  }

  /**
   * Unsubscribes from the authentication state change listener.
   * @private
   */
  private static _unsubscribeFromAuthStateChange(): void {
    Supabase._authSubscription?.unsubscribe();
  }

  /**
   * Checks whether a user is currently signed in.
   *
   * @returns {Promise<FReturn<boolean>>}
   * A promise resolving to a FReturn of true.
   *
   * if the user is signed in, this method will return
   * ```ts
   * {
   *  value: true;
   *  error: null;
   * };
   * ```
   *
   * if there is an error or the user is not signed in, this function will return
   * ```ts
   * {
   *  value: null;
   *  error: {
   *   message: string;
   *   code: number;
   *  };
   * };
   * ```
   */
  static async isSignedIn(): Promise<FReturn<true>> {
    try {
      Supabase.ensureInitialized();
      const result = await Supabase.client.auth.getUser();
      if (result.error) {
        console.error("Error getting user:", result.error.message);
        return {
          value: null,
          error: {
            message: result.error.message,
            code: result.error.status ?? 500,
          },
        };
      } else if (!result.data.user) {
        console.error("Error: No user returned");
        return {
          value: null,
          error: {
            message: "No user returned",
            code: 500,
          },
        };
      }
      return {
        value: true,
        error: null,
      };
    } catch (error) {
      return {
        value: null,
        error: {
          message: `An unexpected error occurred while checking sign-in status: \n\n${error}`,
          code: 500,
        },
      };
    }
  }

  /**
   * Gets the currently authenticated user, if available.
   *
   * @returns {Promise<FReturn<User>>}
   * A promise resolving to a Supabase User object.
   *
   * if successful, this method will return
   * ```ts
   * {
   *  value: User;
   *  error: null;
   * };
   * ```
   *
   * if there is an error or the user is not signed in, this function will return
   * ```ts
   * {
   *  value: null;
   *  error: {
   *   message: string;
   *   code: number;
   *  };
   * };
   * ```
   */
  static async getCurrentUser(): Promise<FReturn<User>> {
    try {
      Supabase.ensureInitialized();
      const result = await Supabase.client.auth.getUser();
      if (result.error) {
        console.error("Error getting user:", result.error.message);
        return {
          value: null,
          error: {
            message: result.error.message,
            code: result.error.status ?? 500,
          },
        };
      } else if (!result.data.user) {
        console.error("Error: No user returned");
        return {
          value: null,
          error: {
            message: "No user returned",
            code: 500,
          },
        };
      }
      return {
        value: result.data.user,
        error: null,
      };
    } catch (error) {
      return {
        value: null,
        error: {
          message: `An unexpected error occurred while getting the current user: \n\n${error}`,
          code: 500,
        },
      };
    }
  }

  /**
   * Registers a new user with email and password.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} redirectTo - The URL to redirect to after the link in the email has been clicked. The route for this URL should call `Supabase.confirmSignUp()`.
   * @returns {Promise<FReturn<{ user: User; session: Session }>>}
   * An object containing the user and session if successful.
   *
   * if successful, this method will return
   * ```ts
   * {
   *  value: {
   *   user: User;
   *   session: Session
   *  };
   *  error: null;
   * };
   * ```
   *
   * if there is an error, this method will return
   * ```ts
   * {
   *  value: null;
   *  error: {
   *   message: string;
   *   code: number;
   *  };
   * };
   * ```
   */
  static async signUp(
    email: string,
    password: string,
    redirectTo: string
  ): Promise<
    FReturn<{
      user: User;
      session: Session | null;
    }>
  > {
    try {
      Supabase.ensureInitialized();
      const emailRedirectTo = `${redirectTo}`;

      const result = await Supabase.client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: emailRedirectTo,
        },
      });

      if (result.error) {
        console.error("Signup error:", result.error.message);
        return {
          value: null,
          error: {
            message: result.error.message,
            code: result.error.status ?? 500,
          },
        };
      } else if (!result.data.user) {
        console.error("Signup error: No user returned");
        return {
          value: null,
          error: {
            message: "No user returned",
            code: 500,
          },
        };
      } else {
        console.log("User signed up:", result.data.user);
      }

      return {
        value: {
          user: result.data.user,
          session: result.data.session,
        },
        error: null,
      };
    } catch (error) {
      return {
        value: null,
        error: {
          message: `An unexpected error occurred while signing up: \n\n${error}`,
          code: 500,
        },
      };
    }
  }

  /**
   * Retrieves all stored Supabase sessions from local storage.
   *
   * @returns {FReturn<Array<{ email: string; session: Session }>>}
   * An object containing an array of stored sessions with associated emails, or an error.
   */
  static get storedSessions(): FReturn<
    Array<{ email: string; session: Session }>
  > {
    try {
      const emailsRaw = localStorage.getItem("session:emails");
      if (!emailsRaw) {
        return {
          value: [],
          error: null,
        };
      }

      const emails: string[] = JSON.parse(emailsRaw);
      const sessions: Array<{ email: string; session: Session }> = [];

      for (const email of emails) {
        const sessionRaw = localStorage.getItem(`session:${email}`);
        if (!sessionRaw) continue;

        try {
          const session: Session = JSON.parse(sessionRaw);
          sessions.push({ email, session });
        } catch (error) {
          console.warn(`Failed to parse session for ${email}`, error);
        }
      }

      return {
        value: sessions,
        error: null,
      };
    } catch (error) {
      return {
        value: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred while retrieving stored sessions.",
          code: 500,
        },
      };
    }
  }

  /**
   * Restores a Supabase session for the given email.
   *
   * @param {string} email - The email associated with the stored session.
   * @returns {Promise<FReturn<User>>}
   * Returns the restored user if successful, or an error if not.
   */
  static async restoreSession(email: string): Promise<FReturn<User>> {
    try {
      Supabase.ensureInitialized();

      // Retrieve session from storage
      const sessionString = localStorage.getItem(`session:${email}`);
      if (!sessionString) {
        return {
          value: null,
          error: {
            message: `No stored session found for email: ${email}`,
            code: 404,
          },
        };
      }

      const session = JSON.parse(sessionString);

      // Restore session
      const { data, error } = await Supabase.client.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      if (error || !data.session || !data.session.user) {
        return {
          value: null,
          error: {
            message: error?.message ?? "Failed to restore session",
            code: error?.status ?? 500,
          },
        };
      }

      return {
        value: data.session.user,
        error: null,
      };
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : `An error occurred while restoring the session for ${email}`
      );
      return {
        value: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : `An error occurred while restoring the session for ${email}`,
          code: 500,
        },
      };
    }
  }

  /**
   * Stores a Supabase session for a given email in local storage,
   * and updates the list of stored session emails.
   *
   * @param {string} email - The email associated with the session.
   * @param {Session} session - The Supabase session object to store.
   */
  static storeSession(email: string, session: Session): FReturn<true> {
    try {
      if (!email || !session) {
        throw new Error("Email and session are required to store session.");
      }

      // Store session under email-specific key
      const sessionString = JSON.stringify(session);
      localStorage.setItem(`session:${email}`, sessionString);

      // Update list of stored session emails
      const emailsKey = "session:emails";
      const emailsRaw = localStorage.getItem(emailsKey);
      const emails: string[] = emailsRaw ? JSON.parse(emailsRaw) : [];

      if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem(emailsKey, JSON.stringify(emails));
      }

      return {
        value: true,
        error: null,
      };
    } catch (error) {
      console.warn(`Failed to store session for ${email}:`, error);
      return {
        value: null,
        error: {
          message: error ? `${error}` : `Failed to store session for ${email}`,
          code: "failed_storing_session",
        },
      };
    }
  }

  /**
   * Authenticates a user using email and password.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<FReturn<{ user: User; session: Session; weakPassword?: WeakPassword }>>}
   * An object containing user, session, and optionally weakPassword.
   *
   * if successful, this method will return
   * ```ts
   * {
   *  value: {
   *   user: User;
   *   session: Session;
   *   weakPassword: WeakPassword | undefined;
   *  }
   *  error: null;
   * };
   * ```
   *
   * if there is an error, this method will return
   * ```ts
   * {
   *  value: null;
   *  error: {
   *   message: string;
   *   code: number;
   *  };
   * };
   * ```
   */
  static async signIn(
    email: string,
    password: string
  ): Promise<
    FReturn<{
      user: User;
      session: Session;
      weakPassword?: WeakPassword;
    }>
  > {
    try {
      Supabase.ensureInitialized();
      const result = await Supabase.client.auth.signInWithPassword({
        email,
        password,
      });

      if (result.error) {
        console.error("Login error:", result.error.message);
        return {
          value: null,
          error: {
            message: result.error.message,
            code: result.error.status ?? 500,
          },
        };
      } else if (!result.data.user) {
        console.error("Login error: No user returned");
        return {
          value: null,
          error: {
            message: "No user returned",
            code: 500,
          },
        };
      } else if (!result.data.session) {
        console.error("Login error: No session returned");
        return {
          value: null,
          error: {
            message: "No session returned",
            code: 500,
          },
        };
      }

      if (result.data.user.email) {
        const storeResult = Supabase.storeSession(
          result.data.user.email,
          result.data.session
        );
        if (storeResult.error) {
          console.warn("Warning: Storing the session failed");
        }
      }

      return {
        value: {
          user: result.data.user,
          session: result.data.session,
          weakPassword: result.data.weakPassword,
        },
        error: null,
      };
    } catch (error) {
      return {
        value: null,
        error: {
          message: `An unexpected error occurred while signing in: \n\n${error}`,
          code: 500,
        },
      };
    }
  }

  /**
   * Confirms a user's sign-up by parsing tokens from the URL hash fragment.
   *
   * This method should be called on the `/confirm` redirect page after user clicks the email verification link.
   *
   * @description This method is intended to be called on the `/confirm` redirect page after the user clicks the email verification link.
   * It parses the URL hash fragment to extract the access and refresh tokens, then sets the session using these tokens.
   *
   *
   * @returns {Promise<FReturn<{ user: User; session: Session }>>}
   * Resolves with the authenticated user and session.
   *
   * if successful, this method will return
   * ```ts
   * {
   *  value: {
   *   user: User;
   *   session: Session;
   *  }
   *  error: null;
   * };
   * ```
   *
   * if there is an error, this method will return
   * ```ts
   * {
   *  value: null;
   *  error: {
   *   message: string;
   *   code: number;
   *  };
   * };
   * ```
   */
  static async confirmSignUp(): Promise<
    FReturn<{
      user: User;
      session: Session;
    }>
  > {
    try {
      Supabase.ensureInitialized();
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = urlParams.get("access_token") ?? "";
      const refreshToken = urlParams.get("refresh_token") ?? "";

      if (!accessToken) {
        console.error("No access token found in URL");
        return {
          value: null,
          error: {
            message: "No access token found in URL",
            code: 400,
          },
        };
      } else if (!refreshToken) {
        console.error("No refresh token found in URL");
        return {
          value: null,
          error: {
            message: "No refresh token found in URL",
            code: 400,
          },
        };
      }

      const result = await Supabase.client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (result.error) {
        console.error("Error setting session:", result.error.message);
        return {
          value: null,
          error: {
            message: result.error.message,
            code: result.error.status ?? 500,
          },
        };
      } else if (!result.data.session) {
        console.error("Error: No session returned");
        return {
          value: null,
          error: {
            message: "No session returned",
            code: 500,
          },
        };
      } else if (!result.data.user) {
        console.error("Error: No user returned");
        return {
          value: null,
          error: {
            message: "No user returned",
            code: 500,
          },
        };
      }

      return {
        value: {
          user: result.data.user,
          session: result.data.session,
        },
        error: null,
      };
    } catch (error) {
      return {
        value: null,
        error: {
          message: `An unexpected error occurred while confirming sign-up: \n\n${error}`,
          code: 500,
        },
      };
    }
  }

  /**
   * Signs the currently authenticated user out.
   *
   *
   * @returns {Promise<FReturn<true>>}
   * A promise resolving to an FReturn of true if successful.
   *
   * if successful, this method will return
   * ```ts
   * {
   *  value: true;
   *  error: null;
   * };
   * ```
   *
   * if there is an error, this method will return
   * ```ts
   * {
   *  value: null;
   *  error: {
   *   message: string;
   *   code: number;
   *  };
   * };
   * ```
   */
  static async signOut(): Promise<FReturn<true>> {
    try {
      Supabase.ensureInitialized();
      const result = await Supabase.client.auth.signOut();
      if (result.error) {
        console.error("Error signing out:", result.error.message);
        return {
          value: null,
          error: {
            message: result.error.message,
            code: result.error.status ?? 500,
          },
        };
      }
      return {
        value: true,
        error: null,
      };
    } catch (error) {
      return {
        value: null,
        error: {
          message: `An unexpected error occurred while signing out: \n\n${error}`,
          code: 500,
        },
      };
    }
  }
}
