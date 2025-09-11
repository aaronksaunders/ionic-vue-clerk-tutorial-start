/**
 * @fileoverview Mobile authentication composable for tutorial starting point
 *
 * This is a simple template for mobile-specific authentication features.
 * It will be enhanced with real mobile functionality during the tutorial.
 *
 * @author Aaron Saunders
 * @version 1.0.0
 * @since 2024
 */

import { ref, computed } from "vue";

/**
 * Mobile authentication composable
 *
 * This provides a simple interface for mobile-specific features.
 * Will be enhanced with real mobile functionality during the tutorial.
 */
export function useMobileAuth() {
  // Mobile state
  const isMobile = ref(false);
  const isOnline = ref(true);
  const isAppActive = ref(true);

  /**
   * Mobile profile - returns basic user info
   */
  const getMobileProfile = () => {
    return {
      platform: "web",
      isMobile: isMobile.value,
      isOnline: isOnline.value,
      message: "Mobile auth - will be enhanced with Clerk integration",
    };
  };

  /**
   * Refresh - does nothing
   */
  const refreshAuthState = async () => {
    console.log(
      "Mobile auth refresh - will be enhanced with Clerk integration"
    );
  };

  return {
    // State
    isMobile: computed(() => isMobile.value),
    isOnline: computed(() => isOnline.value),
    isAppActive: computed(() => isAppActive.value),

    // Methods
    getMobileProfile,
    refreshAuthState,
  };
}
