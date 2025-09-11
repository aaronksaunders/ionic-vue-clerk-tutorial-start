/**
 * @fileoverview Mock authentication composable for tutorial purposes
 *
 * This composable provides mock authentication functionality to replace Clerk
 * during the tutorial. It simulates login, signup, and logout operations.
 *
 * @author Aaron Saunders
 * @version 1.0.0
 * @since 2024
 */

import { ref, computed } from "vue";

/**
 * Mock user interface
 */
interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
}

/**
 * Mock authentication state
 */
const isLoaded = ref(true);
const isSignedIn = ref(false);
const user = ref<MockUser | null>(null);

/**
 * Mock authentication composable
 * @returns Authentication state and methods
 */
export function useAuth() {
  /**
   * Mock sign in function
   * @param email - User email
   * @param password - User password
   * @returns Promise that resolves to sign in result
   */
  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful sign in
    if (email && password) {
      isSignedIn.value = true;
      user.value = {
        id: "mock-user-1",
        email,
        firstName: "John",
        lastName: "Doe",
        imageUrl: "https://via.placeholder.com/150",
      };
      return { status: "complete" };
    }

    throw new Error("Invalid credentials");
  };

  /**
   * Mock sign up function
   * @param email - User email
   * @param password - User password
   * @param firstName - User first name
   * @param lastName - User last name
   * @returns Promise that resolves to sign up result
   */
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful sign up
    if (email && password && firstName && lastName) {
      // Simulate email verification requirement
      if (email.includes("verify")) {
        // User needs to verify email
        return { status: "missing_requirements" };
      }

      // Mock successful sign up after verification
      isSignedIn.value = true;
      user.value = {
        id: "mock-user-1",
        email,
        firstName,
        lastName,
        imageUrl: "https://via.placeholder.com/150",
      };
      return { status: "complete" };
    }

    throw new Error("Invalid sign up data");
  };

  /**
   * Mock sign out function
   * @returns Promise that resolves when sign out is complete
   */
  const signOut = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    isSignedIn.value = false;
    user.value = null;
  };

  /**
   * Mock refresh function
   * @returns Promise that resolves when refresh is complete
   */
  const refresh = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real app, this would refresh the user session
    return { status: "complete" };
  };

  return {
    isLoaded: computed(() => isLoaded.value),
    isSignedIn: computed(() => isSignedIn.value),
    user: computed(() => user.value),
    signIn,
    signUp,
    signOut,
    refresh,
  };
}
