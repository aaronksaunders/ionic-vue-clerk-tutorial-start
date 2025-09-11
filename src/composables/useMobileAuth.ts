import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useAuth } from "./useAuth";
import { Capacitor } from "@capacitor/core";

/**
 * Composable for mobile-specific authentication features
 *
 * Handles mobile-specific challenges and optimizations for authentication.
 * Manages app state changes, network connectivity, and mobile-specific
 * authentication state management.
 *
 * @returns {Object} Mobile authentication state and methods
 * @returns {ComputedRef<boolean>} isMobile - Whether running on mobile device
 * @returns {ComputedRef<boolean>} isOnline - Whether device is online
 * @returns {ComputedRef<boolean>} isAppActive - Whether app is currently active
 * @returns {ComputedRef<Date | null>} lastAuthCheck - Last authentication check timestamp
 * @returns {Function} getMobileProfile - Get mobile-optimized user profile
 * @returns {Function} refreshAuthState - Refresh authentication state
 *
 * @example
 * ```typescript
 * const { isMobile, isOnline, getMobileProfile } = useMobileAuth();
 *
 * // Check if running on mobile
 * if (isMobile.value) {
 *   console.log('Running on mobile device');
 * }
 *
 * // Get mobile profile with additional context
 * const profile = getMobileProfile();
 * if (profile) {
 *   console.log('Mobile profile:', profile);
 * }
 * ```
 *
 * @author Aaron Saunders
 * @version 2.0.0
 * @since 2024
 */
export function useMobileAuth() {
  const { isSignedIn, user, refresh } = useAuth();

  // Mobile state
  const isMobile = ref(false);
  const isOnline = ref(true);
  const isAppActive = ref(true);
  const lastAuthCheck = ref<Date | null>(null);

  /**
   * Check if running on mobile device
   *
   * Determines if the application is running on a native mobile platform
   * using Capacitor's platform detection.
   */
  const checkMobile = () => {
    isMobile.value = Capacitor.isNativePlatform();
    console.log("Mobile platform detected:", isMobile.value);
  };

  /**
   * Handle app state changes
   *
   * Responds to app focus/blur events and refreshes authentication
   * state when the app becomes active.
   *
   * @param {string} state - App state ('active' or 'inactive')
   */
  const handleAppStateChange = (state: string) => {
    const wasActive = isAppActive.value;
    isAppActive.value = state === "active";

    console.log("App state changed:", state, "was active:", wasActive);

    // Refresh auth when app becomes active
    if (state === "active" && !wasActive && isSignedIn.value) {
      refreshAuthState();
    }
  };

  /**
   * Handle network state changes
   *
   * Responds to online/offline events and refreshes authentication
   * state when the device comes back online.
   *
   * @param {boolean} online - Whether the device is online
   */
  const handleNetworkChange = (online: boolean) => {
    const wasOnline = isOnline.value;
    isOnline.value = online;

    console.log("Network state changed:", online ? "online" : "offline");

    // Refresh auth when coming back online
    if (online && !wasOnline && isSignedIn.value) {
      refreshAuthState();
    }
  };

  /**
   * Refresh authentication state
   *
   * Refreshes the current authentication state by getting a fresh token
   * and updating the last check timestamp.
   */
  const refreshAuthState = async () => {
    if (!isSignedIn.value) return;

    try {
      console.log("Refreshing auth state...");
      await refresh();

      lastAuthCheck.value = new Date();
      console.log("Auth state refreshed successfully");
    } catch (err) {
      console.error("Failed to refresh auth state:", err);
    }
  };

  /**
   * Get mobile-optimized user profile
   *
   * Returns a user profile object with additional mobile-specific context
   * including device state and connectivity information.
   *
   * @returns {Object | null} Mobile profile object or null if no user
   */
  const getMobileProfile = () => {
    if (!user.value) return null;

    return {
      id: user.value.id,
      email: user.value.email,
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      fullName: `${user.value.firstName} ${user.value.lastName}`,
      imageUrl: user.value.imageUrl,
      isMobile: isMobile.value,
      isOnline: isOnline.value,
      isAppActive: isAppActive.value,
      lastAuthCheck: lastAuthCheck.value,
    };
  };

  /**
   * Watch for authentication state changes and handle mobile-specific logic
   *
   * Sets up watchers for authentication state changes and handles
   * mobile-specific refresh logic when the user signs in.
   *
   * @private
   */
  const watchMobileAuthState = () => {
    watch(
      isSignedIn,
      (newIsSignedIn) => {
        if (isMobile.value) {
          console.log("Mobile auth state changed:", {
            isSignedIn: newIsSignedIn,
            isOnline: isOnline.value,
            isAppActive: isAppActive.value,
          });

          // Refresh auth state when user signs in
          if (newIsSignedIn) {
            refreshAuthState();
          }
        }
      },
      { immediate: true }
    );
  };

  // Lifecycle
  onMounted(() => {
    checkMobile();

    if (isMobile.value) {
      // Listen for mobile-specific events
      window.addEventListener("focus", () => handleAppStateChange("active"));
      window.addEventListener("blur", () => handleAppStateChange("inactive"));
      window.addEventListener("online", () => handleNetworkChange(true));
      window.addEventListener("offline", () => handleNetworkChange(false));

      // Set up mobile auth state watching
      watchMobileAuthState();
    }
  });

  onUnmounted(() => {
    if (isMobile.value) {
      window.removeEventListener("focus", () => handleAppStateChange("active"));
      window.removeEventListener("blur", () =>
        handleAppStateChange("inactive")
      );
      window.removeEventListener("online", () => handleNetworkChange(true));
      window.removeEventListener("offline", () => handleNetworkChange(false));
    }
  });

  return {
    // State
    isMobile: computed(() => isMobile.value),
    isOnline: computed(() => isOnline.value),
    isAppActive: computed(() => isAppActive.value),
    lastAuthCheck: computed(() => lastAuthCheck.value),

    // Methods
    getMobileProfile,
    refreshAuthState,
  };
}
