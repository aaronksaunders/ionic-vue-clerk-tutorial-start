<!--
  @fileoverview App Component - Basic Auth Template
  
  Main application component for the basic auth template.
  Provides the main app structure with router outlet.
  
  @author Aaron Saunders
  @version 1.0.0
  @since 2024
-->

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { useAuth } from "./composables/useAuth";

const router = useRouter();
const route = useRoute();
const { isSignedIn, isLoaded } = useAuth();

/**
 * Handle authentication-based navigation
 * This runs after auth is loaded
 */
watch(
  [isSignedIn, route],
  ([signedIn, currentRoute]) => {
    // Only run protection after auth is loaded
    if (!isLoaded.value) return;

    // Define protected routes
    const protectedRoutes = ["/profile"];
    const guestRoutes = ["/login", "/signup"];

    // Check if route requires authentication
    if (protectedRoutes.includes(currentRoute.path) && !signedIn) {
      router.replace("/login");
      return;
    }

    // Check if route requires guest (not authenticated)
    if (guestRoutes.includes(currentRoute.path) && signedIn) {
      router.replace("/profile");
      return;
    }
  },
  { immediate: true }
);
</script>
