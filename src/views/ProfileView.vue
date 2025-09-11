<!--
  @fileoverview Profile View - Basic Auth Template
  
  This view displays the user's profile information and provides access to
  authentication actions. Only accessible when the user is authenticated.
  
  Features:
  - User profile display
  - Authentication actions component
  - Sign out functionality
  - Protected route (requires authentication)
  
  @author Aaron Saunders
  @version 1.0.0
  @since 2024
-->

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleSignOut" color="danger">
            <ion-icon name="log-out-outline" slot="start"></ion-icon>
            Sign Out
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="container">
        <!-- User Profile Card -->
        <ion-card>
          <ion-card-content>
            <div class="profile-container">
              <!-- Avatar at the top -->
              <ion-avatar class="profile-avatar">
                <img
                  v-if="user?.imageUrl"
                  :src="user.imageUrl"
                  :alt="
                    user ? `${user.firstName} ${user.lastName}` : 'User Avatar'
                  "
                />
                <div v-else class="avatar-placeholder">
                  {{ (user?.firstName || "U").charAt(0).toUpperCase() }}
                </div>
              </ion-avatar>

              <!-- User details below avatar -->
              <div class="profile-details">
                <h2 class="welcome-text">
                  Welcome, {{ user?.firstName || "User" }}!
                </h2>
                <p class="user-email">
                  {{
                    user?.emailAddresses[0]?.emailAddress ||
                    "Email not provided"
                  }}
                </p>

                <div class="user-info">
                  <p>
                    <strong>Name:</strong>
                    {{ user?.firstName }} {{ user?.lastName }}
                  </p>
                  <p>
                    <strong>Email:</strong>
                    {{
                      user?.emailAddresses[0]?.emailAddress || "Not provided"
                    }}
                  </p>
                  <p>
                    <strong>User ID:</strong> {{ user?.id || "Not available" }}
                  </p>
                  <p>
                    <strong>Member since:</strong>
                    {{ formatDate(new Date()) }}
                  </p>
                </div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Auth Actions Component -->
        <AuthActions />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonAvatar,
} from "@ionic/vue";
import { useAuth } from "../composables/useAuth";
import AuthActions from "../components/AuthActions.vue";

const router = useRouter();
const { user, signOut } = useAuth();

/**
 * Handles user sign out and navigates to login view.
 * @async
 * @returns {Promise<void>}
 */
const handleSignOut = async () => {
  await signOut();
  router.push("/login");
};

/**
 * Formats a date for display in the profile view.
 * @param {Date | null | undefined} date - The date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date: Date | null | undefined) => {
  if (!date) return "Not available";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.container {
  padding: 16px;
}

.profile-container {
  text-align: center;
  padding: 20px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  --border-radius: 50%;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--ion-color-primary),
    var(--ion-color-secondary)
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  color: white;
}

.profile-details {
  text-align: center;
}

.welcome-text {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.user-email {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-info {
  text-align: left;
  background: var(--ion-color-light);
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
}

.user-info p {
  margin: 12px 0;
  font-size: 14px;
  line-height: 1.4;
}

.user-info strong {
  color: var(--ion-color-primary);
  font-weight: 600;
}
</style>
