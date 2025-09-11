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
        <ion-button expand="block" disabled color="tertiary">
          <ion-icon name="person" slot="start"></ion-icon>
          Get User Profile
        </ion-button>

        <ion-button expand="block" disabled color="medium">
          <ion-icon name="mail-outline" slot="start"></ion-icon>
          Get Session Info
        </ion-button>

        <ion-button expand="block" disabled color="secondary">
          <ion-icon name="refresh-outline" slot="start"></ion-icon>
          Refresh Session
        </ion-button>

        <ion-item>
          <ion-label>
            <h3>Status</h3>
            <p>Authentication - will be enhanced with Clerk integration</p>
          </ion-label>
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

// Simple template - authentication actions will be added during tutorial
</script>
