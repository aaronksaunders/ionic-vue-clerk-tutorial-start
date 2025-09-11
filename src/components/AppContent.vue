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
 * Wait for Clerk to be fully loaded before rendering
 * This makes the component truly async for Suspense
 */
await new Promise((resolve) => {
  const unwatch = watch(
    isLoaded,
    (loaded) => {
      if (loaded) {
        unwatch(); // Stop watching
        resolve(undefined);
      }
    },
    { immediate: true }
  );
});

/**
 * Handle authentication-based navigation
 * This runs after Clerk is loaded
 */
watch(
  [isSignedIn, route],
  ([signedIn, currentRoute]) => {
    // Define protected routes
    const protectedRoutes = ["/profile"];
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
