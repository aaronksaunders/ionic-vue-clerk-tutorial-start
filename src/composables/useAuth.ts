/**
 * @fileoverview Authentication composable for tutorial starting point
 *
 * This is a simple template that simulates authentication state and methods.
 * It will be completely replaced with real Clerk functionality during the tutorial.
 *
 * @author Aaron Saunders
 * @version 1.0.0
 * @since 2024
 */

import { ref, computed } from "vue";
import { useClerk, useUser } from "@clerk/vue";
import { toastController } from "@ionic/vue";
/**
 * User interface
 */
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
}

/**
 * Authentication state
 */
const isLoading = ref(false);
// const isLoaded = ref(true);
const isSignedIn = ref(false);
const user = ref<User | null>(null);
const error = ref("");

/**
 * Authentication composable
 *
 * This provides a simple interface that matches what we'll build with Clerk.
 * All methods are templates and will be replaced during the tutorial.
 */
export function useAuth() {
  const clerk = useClerk();
  const { isSignedIn, user, isLoaded } = useUser();

  // Internal state
  const isLoading = ref(false);
  const error = ref("");

  /**
   * Signs in a user with email and password credentials.
   * @async
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<boolean>} True if sign in was successful, false otherwise
   */
  const signIn = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = "";
    try {
      const result = await clerk.value?.client?.signIn.create({
        identifier: email,
        password: password,
      });

      if (result?.status === "complete") {
        await clerk.value?.setActive({ session: result.createdSessionId });
        return true;
      } else {
        error.value = "Sign in failed";
        return false;
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign in failed";
      error.value = errorMessage;
      console.error("Sign in error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Signs up a new user with email, password, and name information.
   * @async
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @returns {Promise<boolean>} True if sign up was successful, false otherwise
   */
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    isLoading.value = true;
    error.value = "";

    try {
      const result = await clerk.value?.client?.signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      console.log("Sign up result:", result);
      if (result?.status === "complete") {
        await clerk.value?.setActive({ session: result.createdSessionId });
        return true;
      } else if (result?.status === "missing_requirements") {
        await result.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        error.value = "Email verification required";
        return false;
      } else {
        error.value = "Sign up failed";
        return false;
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign up failed";
      error.value = errorMessage;
      console.error("Sign up error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Signs out the current user and clears the session.
   * @async
   * @returns {Promise<boolean>} True if sign out was successful, false otherwise
   */
  const signOut = async (): Promise<boolean> => {
    isLoading.value = true;
    try {
      await clerk.value?.signOut();
      return true;
    } catch (err: unknown) {
      console.error("Sign out error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Retrieves the current user profile information.
   * @async
   * @returns {Promise<User | null>} The user profile object or null if not signed in
   */
  const handleGetUserProfile = async (): Promise<User | null> => {
    if (user.value) {
      console.log("User Profile:", user.value);
      return user.value;
    } else {
      console.log("User is not signed in.");
      return null;
    }
  };

  /**
   * Retrieves the current session information.
   * @async
   * @returns {Promise<any | null>} The session object or null if not signed in
   */
  const handleGetSessionInfo = async (): Promise<any | null> => {
    if (isSignedIn.value) {
      const session = await clerk.value?.session;
      console.log("Session Info:", session);
      return session;
    } else {
      console.log("User is not signed in.");
      return null;
    }
  };

  /**
   * Refreshes the current user session.
   * @async
   * @returns {Promise<boolean>} True if refresh was successful, false otherwise
   */
  const handleRefreshSession = async (): Promise<boolean> => {
    if (isSignedIn.value) {
      try {
        await clerk.value?.session?.reload();
        console.log("Session refreshed");
        return true;
      } catch (err: unknown) {
        console.error("Error refreshing session:", err);
        return false;
      }
    } else {
      console.log("User is not signed in.");
      return false;
    }
  };

  /**
   * Handles email verification with the provided code.
   * @async
   * @param {string} code - The verification code from email
   * @returns {Promise<boolean>} True if verification was successful, false otherwise
   */
  const handleVerification = async (code: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = "";

    if (clerk.value) {
      try {
        const signUpAttempt = clerk.value?.client?.signUp;
        if (!signUpAttempt) {
          throw new Error("No sign-up attempt found");
        }

        // Assuming the user has a pending email address verification
        const verification =
          await signUpAttempt.attemptEmailAddressVerification({
            code: code,
          });

        if (verification?.status === "complete") {
          await clerk.value?.setActive({
            session: verification.createdSessionId,
          });
          console.log("Email verified successfully");
          return true;
        } else {
          console.log("Email verification failed");
          return false;
        }
      } catch (err: unknown) {
        console.error("Error during email verification:", err);
        return false;
      }
    } else {
      console.log("Clerk is not initialized.");
      return false;
    }
  };

  return {
    // State
    /** @type {import('vue').ComputedRef<boolean>} Whether the user is currently signed in */
    isSignedIn: computed(() => isSignedIn.value),
    /** @type {import('vue').ComputedRef<User | null>} Current user object or null if not signed in */
    user: computed(() => user.value),
    /** @type {import('vue').ComputedRef<boolean>} Whether Clerk has finished loading */
    isLoaded: computed(() => isLoaded.value),
    /** @type {import('vue').ComputedRef<boolean>} Whether an authentication operation is in progress */
    isLoading: computed(() => isLoading.value),
    /** @type {import('vue').ComputedRef<string>} Current error message, empty string if no error */
    error: computed(() => error.value),

    // Methods
    signIn,
    signUp,
    signOut,
    getUserProfile: handleGetUserProfile,
    getSession: handleGetSessionInfo,
    refreshSession: handleRefreshSession,
    handleVerification,
  };
}
