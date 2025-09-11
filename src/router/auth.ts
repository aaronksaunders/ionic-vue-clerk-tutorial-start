/**
 * @fileoverview Authentication Router Configuration
 *
 * Router configuration for the basic auth template with protected routes
 * and authentication guards.
 *
 * @author Aaron Saunders
 * @version 1.0.0
 * @since 2024
 */

import { createRouter, createWebHistory } from "@ionic/vue-router";

// Import views
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";
import ProfileView from "../views/ProfileView.vue";

/**
 * Application routes configuration
 * @type {Array<import('vue-router').RouteRecordRaw>}
 */
const routes: import("vue-router").RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUpView,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
  },
];

/**
 * Creates and exports the main router for authentication views.
 *
 * @type {import('vue-router').Router}
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
