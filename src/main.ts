/**
 * @fileoverview Main application entry point for Ionic Tutorial App
 *
 * This file initializes the Vue application with Ionic UI components
 * for a basic Ionic app with login, signup, and profile views.
 *
 * @author Aaron Saunders
 * @version 1.0.0
 * @since 2024
 */

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/auth";

import { IonicVue } from "@ionic/vue";

// Import and register Ionicons
import { addIcons } from "ionicons";
import {
  logInOutline,
  personAddOutline,
  logOutOutline,
  refreshOutline,
  mailOutline,
  personOutline,
  warning,
  checkmark,
} from "ionicons/icons";

// Register all icons used in the app
addIcons({
  "log-in-outline": logInOutline,
  "person-add-outline": personAddOutline,
  "log-out-outline": logOutOutline,
  "refresh-outline": refreshOutline,
  "mail-outline": mailOutline,
  "check-mark-outline": checkmark,
  "person-outline": personOutline,
  "warning-outline": warning,
  "checkmark-outline": checkmark,
});

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";
import "@ionic/vue/css/display.css";

/* Ionic CSS utilities */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";

/* Theme variables */
import "./theme/variables.css";
import { clerkPlugin } from "@clerk/vue";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const app = createApp(App)
  .use(IonicVue, {
    mode: "ios",
  })
  .use(router)
  .use(clerkPlugin, {
    publishableKey: PUBLISHABLE_KEY,
  });

// Wait for router to be ready before mounting
router.isReady().then(() => {
  app.mount("#app");
});
