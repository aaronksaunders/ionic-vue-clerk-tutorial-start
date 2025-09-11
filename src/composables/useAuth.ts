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
   * Sign in - always fails for demo purposes
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
    } catch (err: any) {
      error.value = err.message || "Sign in failed";
      console.error("Sign in error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Sign up - always fails for demo purposes
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
    } catch (err: any) {
      error.value = err.message || "Sign up failed";
      console.error("Sign up error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Sign out - resets state
   */
  const signOut = async (): Promise<Boolean> => {
    isLoading.value = true;
    try {
      await clerk.value?.signOut();
      return true;
    } catch (err: any) {
      console.error("Sign out error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const handleGetUserProfile = async () => {
    if (user.value) {
      console.log("User Profile:", user.value);
      return user.value;
    } else {
      console.log("User is not signed in.");
      return null;
    }
  };

  const handleGetSessionInfo = async () => {
    if (isSignedIn.value) {
      const session = await clerk.value?.session;
      console.log("Session Info:", session);
      return session;
    } else {
      console.log("User is not signed in.");
      return null;
    }
  };

  const handleRefreshSession = async () => {
    if (isSignedIn.value) {
      try {
        await clerk.value?.session?.reload();
        console.log("Session refreshed");
        return true;
      } catch (err: any) {
        console.error("Error refreshing session:", err);
        return false;
      }
    } else {
      console.log("User is not signed in.");
      return false;
    }
  };

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
      } catch (err: any) {
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
    isSignedIn: computed(() => isSignedIn.value),
    user: computed(() => user.value),
    isLoaded: computed(() => isLoaded.value),
    isLoading: computed(() => isLoading.value),
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
