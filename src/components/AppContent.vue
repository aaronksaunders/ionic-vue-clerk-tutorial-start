<!--
  @fileoverview App Content Component - Router and Authentication Handler
  
  This component handles the main application routing and authentication-based
  navigation. It waits for Clerk to load before rendering and manages route
  protection based on authentication state.
  
  Features:
  - Suspense-compatible async loading
  - Authentication-based route protection
  - Guest route handling
  - Verification state management
  
  @author Aaron Saunders
  @version 1.0.0
  @since 2024
-->

<template>
  <ion-router-outlet />
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { IonRouterOutlet } from "@ionic/vue";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const route = useRoute();
const { isSignedIn, isLoaded } = useAuth();

/**
 * Wait for Clerk to be fully loaded before rendering.
 * This makes the component truly async for Suspense.
 * @async
 * @returns {Promise<void>} Resolves when Clerk is loaded
 */
await new Promise<void>((resolve) => {
  const unwatch = watch(
    isLoaded,
    (loaded: boolean) => {
      if (loaded) {
        unwatch(); // Stop watching
        resolve();
      }
    },
    { immediate: true }
  );
});

/**
 * Handle authentication-based navigation.
 * This runs after Clerk is loaded and manages route protection.
 * @param {[boolean, import('vue-router').RouteLocationNormalizedLoaded]} params - Array containing signed in state and current route
 */
watch(
  [isSignedIn, route],
  ([signedIn, currentRoute]: [
    boolean,
    import("vue-router").RouteLocationNormalizedLoaded
  ]) => {
    // Define protected routes that require authentication
    const protectedRoutes = ["/profile"];
    // Define guest routes that should redirect if user is signed in
    const guestRoutes = ["/login", "/signup"];

    // Check if route requires authentication
    if (protectedRoutes.includes(currentRoute.path) && !signedIn) {
      router.replace("/login");
      return;
    }

    // Check if route requires guest (not authenticated)
    // Only redirect from signup if user is fully signed in (not just in verification state)
    if (guestRoutes.includes(currentRoute.path) && signedIn) {
      // Don't redirect from signup if there might be verification in progress
      if (currentRoute.path === "/signup") {
        // Check if there's a verification state in localStorage or URL params
        const hasVerificationState =
          localStorage.getItem("needsVerification") === "true" ||
          currentRoute.query.verify === "true";
        if (hasVerificationState) {
          return; // Stay on signup for verification
        }
      }
      router.replace("/profile");
      return;
    }
  },
  { immediate: true }
);
</script>
