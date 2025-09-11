<!--
  @fileoverview Login View - Basic Auth Template
  
  This view provides a clean login interface using headless authentication.
  Users can sign in with their email and password credentials.
  
  Features:
  - Email and password login form
  - Form validation and error handling
  - Loading states and user feedback
  - Navigation to sign up view
  
  @author Aaron Saunders
  @version 1.0.0
  @since 2024
-->

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sign In</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="container">
        <!-- Login Form -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Welcome Back</ion-card-title>
            <ion-card-subtitle>Sign in to your account</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                :disabled="isLoading"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Password</ion-label>
              <ion-input
                v-model="password"
                type="password"
                placeholder="Enter your password"
                :disabled="isLoading"
              ></ion-input>
            </ion-item>

            <div class="ion-padding">
              <ion-button
                @click="handleSignIn"
                expand="block"
                :disabled="isLoading || !email || !password"
              >
                <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
                <ion-icon v-else name="log-in-outline" slot="start"></ion-icon>
                Sign In
              </ion-button>

              <ion-button
                @click="navigateToSignUp"
                expand="block"
                fill="outline"
                :disabled="isLoading"
              >
                <ion-icon name="person-add-outline" slot="start"></ion-icon>
                Don't have an account? Sign Up
              </ion-button>
            </div>

            <!-- Error Display -->
            <ion-item v-if="error" color="danger">
              <ion-icon name="warning" slot="start"></ion-icon>
              <ion-label>{{ error }}</ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
} from "@ionic/vue";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { signIn } = useAuth();

// Form state
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const error = ref("");

/**
 * Handle sign in form submission
 */
const handleSignIn = async () => {
  if (!email.value || !password.value) {
    error.value = "Please fill in all fields";
    return;
  }

  try {
    isLoading.value = true;
    error.value = "";

    await signIn(email.value, password.value);

    // Clear form
    email.value = "";
    password.value = "";
    // Navigate to profile
    router.push("/profile");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Sign in failed";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Navigate to sign up view
 */
const navigateToSignUp = () => {
  router.push("/signup");
};
</script>

<style scoped>
.container {
  padding: 16px;
  max-width: 400px;
  margin: 0 auto;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-button {
  margin: 8px 0;
}
</style>
