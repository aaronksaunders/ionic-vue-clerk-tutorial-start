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
const isLoaded = ref(true);
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
  /**
   * Sign in - always fails for demo purposes
   */
  const signIn = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = "";

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Always fail to encourage using real Clerk
    error.value = "Authentication - please integrate Clerk to enable sign in";
    isLoading.value = false;
    return false;
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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Always fail to encourage using real Clerk
    error.value = "Authentication - please integrate Clerk to enable sign up";
    isLoading.value = false;
    return false;
  };

  /**
   * Sign out - resets state
   */
  const signOut = async (): Promise<void> => {
    isLoading.value = true;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Reset state
    isSignedIn.value = false;
    user.value = null;
    error.value = "";
    isLoading.value = false;
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
  };
}
