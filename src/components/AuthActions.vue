<!--
  @fileoverview Auth Actions Component - Tutorial Starting Point
  
  Simple component that will be enhanced with Clerk authentication actions.
  This is the starting point for the tutorial.
  
  @author Aaron Saunders
  @version 1.0.0
  @since 2024
-->

<template>
  <div>
    <ion-card>
      <ion-card-header>
        <ion-card-title>Auth Actions</ion-card-title>
        <ion-card-subtitle>Authentication actions</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-button
          expand="block"
          @click="handleGetUserProfile"
          :disabled="!isSignedIn"
          color="tertiary"
        >
          <ion-icon name="person-outline" slot="start"></ion-icon>
          Get User Profile
        </ion-button>

        <ion-button
          expand="block"
          :disabled="!isSignedIn"
          color="medium"
          @click="handleGetSessionInfo"
        >
          <ion-icon name="mail-outline" slot="start"></ion-icon>
          Get Session Info
        </ion-button>

        <ion-button
          expand="block"
          color="secondary"
          :disabled="!isSignedIn"
          @click="handleRefreshSession"
        >
          <ion-icon name="refresh-outline" slot="start"></ion-icon>
          Refresh Session
        </ion-button>

        <ion-item>
          <ion-item v-if="actionResult">
            <ion-label>
              <h3>Result</h3>
              <pre>{{ actionResult }}</pre>
            </ion-label>
          </ion-item>
        </ion-item>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

const { isSignedIn, getUserProfile, getSession, refreshSession } = useAuth();
/** @type {import('vue').Ref<string>} Stores the result of the last action performed */
const actionResult = ref("");

/**
 * Handles fetching and displaying the user profile.
 * @async
 * @returns {Promise<void>}
 */
const handleGetUserProfile = async () => {
  if (isSignedIn.value) {
    const profile = await getUserProfile();
    actionResult.value = JSON.stringify(profile, null, 2);
    console.log("User Profile:", profile);
  } else {
    console.log("User is not signed in.");
  }
};

/**
 * Handles fetching and displaying the session info.
 * @async
 * @returns {Promise<void>}
 */
const handleGetSessionInfo = async () => {
  if (isSignedIn.value) {
    const session = await getSession();
    actionResult.value = JSON.stringify(session, null, 2);
    console.log("Session Info:", session);
  } else {
    console.log("User is not signed in.");
  }
};
/**
 * Handles refreshing the user session and displays result.
 * @async
 * @returns {Promise<void>}
 */
const handleRefreshSession = async () => {
  if (isSignedIn.value) {
    const success = await refreshSession();
    actionResult.value = success
      ? "Session refreshed"
      : "Failed to refresh session";
  } else {
    console.log("User is not signed in.");
  }
};
</script>
