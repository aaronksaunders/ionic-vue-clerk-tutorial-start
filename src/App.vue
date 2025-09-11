<!--
  @fileoverview App Component - Tutorial Starting Point
  
  Simple app structure that will be enhanced with Clerk authentication.
  This is the starting point for the tutorial.
  
  @author Aaron Saunders
  @version 1.0.0
  @since 2024
-->

<template>
  <ion-app>
    <Suspense>
      <!-- Main Content -->
      <template #default>
        <AppContent />
      </template>

      <!-- Fallback Content -->
      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp } from "@ionic/vue";
import { defineAsyncComponent } from "vue";
import LoadingSpinner from "./components/LoadingSpinner.vue";

// Define the main app content as an async component
const AppContent = defineAsyncComponent(
  () => import("@/components/AppContent.vue")
);
</script>
