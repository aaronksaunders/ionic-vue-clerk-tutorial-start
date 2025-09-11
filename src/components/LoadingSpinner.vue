<!--
  @fileoverview Loading Spinner Component
  
  A loading spinner component that displays while the app is initializing.
  Similar to React Suspense, this shows a loading state until authentication
  and other initialization is complete.
  
  @author Aaron Saunders
  @version 1.0.0
  @since 2024
-->

<template>
  <ion-page>
    <ion-content class="loading-content">
      <div class="loading-container">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <h2>Loading...</h2>
        <p>Initializing authentication</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonSpinner } from "@ionic/vue";
</script>

<style scoped>
.loading-content {
  --background: var(--ion-color-light);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
}

.loading-container h2 {
  margin-top: 20px;
  color: var(--ion-color-primary);
  font-weight: 600;
}

.loading-container p {
  margin-top: 10px;
  color: var(--ion-color-medium);
  font-size: 14px;
}

ion-spinner {
  --color: var(--ion-color-primary);
  transform: scale(1.5);
}
</style>
