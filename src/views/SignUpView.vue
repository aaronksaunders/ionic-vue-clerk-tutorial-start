<!--
  @fileoverview Sign Up View - Basic Auth Template
  
  This view provides a clean sign up interface using headless authentication.
  Users can create new accounts with their email, name, and password.
  
  Features:
  - Complete sign up form with name fields
  - Form validation and error handling
  - Loading states and user feedback
  - Navigation to login view
  
  @author Aaron Saunders
  @version 1.0.0
  @since 2024
-->

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Create Account</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="container">
        <!-- Sign Up Form -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Create Your Account</ion-card-title>
            <ion-card-subtitle>Join us today</ion-card-subtitle>
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
              <ion-label position="stacked">First Name</ion-label>
              <ion-input
                v-model="firstName"
                type="text"
                placeholder="Enter your first name"
                :disabled="isLoading"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Last Name</ion-label>
              <ion-input
                v-model="lastName"
                type="text"
                placeholder="Enter your last name"
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

            <ion-item>
              <ion-label position="stacked">Confirm Password</ion-label>
              <ion-input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                :disabled="isLoading"
              ></ion-input>
            </ion-item>

            <div class="ion-padding">
              <ion-button
                @click="handleSignUp"
                expand="block"
                :disabled="
                  isLoading || !email || !password || !firstName || !lastName
                "
              >
                <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
                <ion-icon
                  v-else
                  name="person-add-outline"
                  slot="start"
                ></ion-icon>
                Create Account
              </ion-button>

              <ion-button
                @click="navigateToLogin"
                expand="block"
                fill="outline"
                :disabled="isLoading"
              >
                <ion-icon name="log-in-outline" slot="start"></ion-icon>
                Already have an account? Sign In
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
const { signUp } = useAuth();

// Form state
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const isLoading = ref(false);
const error = ref("");

/**
 * Handle sign up form submission
 */
const handleSignUp = async () => {
  if (!email.value || !password.value || !firstName.value || !lastName.value) {
    error.value = "Please fill in all fields";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  try {
    isLoading.value = true;
    error.value = "";

    await signUp(email.value, password.value, firstName.value, lastName.value);

    // Clear form
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    firstName.value = "";
    lastName.value = "";
    // Navigate to profile
    router.push("/profile");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Sign up failed";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Navigate to login view
 */
const navigateToLogin = () => {
  router.push("/login");
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
