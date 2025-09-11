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
      <!-- Add this div for CAPTCHA -->
      <div id="clerk-captcha"></div>

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

            <!-- needsVerification Display -->
            <div v-if="needsVerification" class="ion-padding">
              <ion-item>
                <ion-label position="stacked">Verification Code</ion-label>
                <ion-input
                  v-model="verificationCode"
                  type="text"
                  placeholder="Enter code from email"
                  :disabled="isLoading"
                ></ion-input>
              </ion-item>
              <ion-button
                @click="handleVerify"
                expand="block"
                :disabled="isLoading || !verificationCode"
              >
                <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
                <ion-icon
                  v-else
                  name="checkmark-outline"
                  slot="start"
                ></ion-icon>
                Verify Account
              </ion-button>
            </div>

            <!-- Error Display -->
            <ion-item v-if="localError" color="danger">
              <ion-icon name="warning" slot="start"></ion-icon>
              <ion-label>{{ localError }}</ion-label>
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
const { signUp, handleVerification, error } = useAuth();

// Form state
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const isLoading = ref(false);
const localError = ref("");
const needsVerification = ref(
  localStorage.getItem("needsVerification") === "true"
);
const verificationCode = ref("");

/**
 * Handles sign up form submission.
 * Validates input, calls signUp, and navigates on success.
 * @async
 * @returns {Promise<void>}
 */
const handleSignUp = async () => {
  if (!email.value || !password.value || !firstName.value || !lastName.value) {
    localError.value = "Please fill in all fields";
    return;
  }

  if (password.value !== confirmPassword.value) {
    localError.value = "Passwords do not match";
    return;
  }

  try {
    isLoading.value = true;
    localError.value = "";

    const result = await signUp(
      email.value,
      password.value,
      firstName.value,
      lastName.value
    );
    if (result) {
      clearForm();
      needsVerification.value = false;
      localStorage.setItem("needsVerification", "false");

      // Navigate to profile
      router.push("/profile");
    } else {
      console.error("Sign up failed:", error.value);
      if (
        error.value?.includes("verification") ||
        error.value?.includes("Email verification required") ||
        error.value?.includes("missing_requirements") ||
        error.value?.includes("CAPTCHA")
      ) {
        needsVerification.value = true;
        localStorage.setItem("needsVerification", "true");
      }
    }
  } catch (err) {
    localError.value = err instanceof Error ? err.message : "Sign up failed";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Handles verification code submission.
 * Calls handleVerification and navigates on success.
 * @async
 * @returns {Promise<void>}
 */
const handleVerify = async () => {
  if (!verificationCode.value) {
    localError.value = "Please enter the verification code";
    return;
  }

  try {
    isLoading.value = true;
    localError.value = "";

    const result = await handleVerification(verificationCode.value);
    if (result) {
      needsVerification.value = false;
      localStorage.setItem("needsVerification", "false");
      clearForm();
      router.push("/profile");
    }
  } catch (err) {
    localError.value =
      err instanceof Error ? err.message : "Verification failed";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Clears all form fields and resets local state.
 */
const clearForm = () => {
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
  firstName.value = "";
  lastName.value = "";
  localError.value = "";
  localStorage.setItem("needsVerification", "false");
  verificationCode.value = "";
  needsVerification.value = false;
};

/**
 * Navigates to the login view.
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
