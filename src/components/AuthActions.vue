<template>
  <div>
    <!-- Auth Actions -->
    <ion-card>
      <ion-card-header>
        <ion-card-title>Auth Actions</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-button
          expand="block"
          @click="handleGetUserProfile"
          :disabled="!isSignedIn"
          color="tertiary"
        >
          <ion-icon name="person" slot="start"></ion-icon>
          Get User Profile
        </ion-button>

        <ion-button
          expand="block"
          @click="handleGetSessionInfo"
          :disabled="!isSignedIn"
          color="medium"
        >
          <ion-icon name="mail-outline" slot="start"></ion-icon>
          Get Session Info
        </ion-button>

        <ion-button
          expand="block"
          @click="handleRefreshSession"
          :disabled="!isSignedIn"
          color="medium"
        >
          <ion-icon name="refresh-outline" slot="start"></ion-icon>
          Refresh Session
        </ion-button>

        <ion-button
          expand="block"
          @click="handleSignOut"
          :disabled="!isSignedIn"
          color="danger"
        >
          <ion-icon name="log-out-outline" slot="start"></ion-icon>
          Sign Out
        </ion-button>
      </ion-card-content>
    </ion-card>

    <!-- Result Display -->
    <ion-card v-if="result">
      <ion-card-header>
        <ion-card-title>Result</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <pre>{{ result }}</pre>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { useAuth } from "../composables/useAuth";

// Get auth state and methods
const { isSignedIn, user, refresh, signOut } = useAuth();

// Result display
const result = ref("");

// Mock methods for tutorial purposes
const handleGetSessionInfo = async () => {
  try {
    if (isSignedIn.value) {
      result.value = JSON.stringify(
        {
          isSignedIn: true,
          userId: user.value?.id,
          email: user.value?.email,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      );
    } else {
      result.value = "No active session";
    }
  } catch (err: any) {
    console.error("Error in handleGetSessionInfo:", err);
    result.value = `Error: ${err.message}`;
  }
};

const handleGetUserProfile = async () => {
  try {
    if (user.value) {
      result.value = JSON.stringify(user.value, null, 2);
    } else {
      result.value = "No user profile available";
    }
  } catch (err: any) {
    console.error("Error in handleGetUserProfile:", err);
    result.value = `Error: ${err.message}`;
  }
};

const handleRefreshSession = async () => {
  try {
    await refresh();
    result.value = "Session refreshed successfully";
  } catch (err: any) {
    console.error("Error in handleRefreshSession:", err);
    result.value = `Error: ${err.message}`;
  }
};

const handleSignOut = async () => {
  try {
    await signOut();
    result.value = "Signed out successfully";
  } catch (err: any) {
    console.error("Error in handleSignOut:", err);
    result.value = `Error: ${err.message}`;
  }
};
</script>
