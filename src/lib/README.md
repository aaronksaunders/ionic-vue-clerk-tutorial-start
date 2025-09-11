# Consolidated Clerk Authentication Library

This library provides a clean, reusable authentication system for Vue + Ionic + Clerk applications. It encapsulates all Clerk functionality into simple, composable functions that are easy to use and maintain.

## Features

- **Clean API**: Simple, intuitive methods for authentication
- **Type Safe**: Full TypeScript support with proper interfaces
- **Mobile Optimized**: Handles mobile-specific challenges and optimizations
- **Error Handling**: Centralized error management and user feedback
- **Toast Integration**: Built-in user feedback with Ionic toasts
- **Modular**: Use only what you need
- **Reusable**: Easy to copy to new projects

## Composables

### `useAuth()`
Core authentication composable that provides:
- Authentication state management
- Sign in/up/out methods
- JWT token access
- User profile and session information
- Session refresh functionality

### `useAuth()`
Composable for authentication UI components that provides:
- Form state management
- Form validation
- Mode switching (sign in/sign up)
- Form submission handling

### `useMobileAuth()`
Mobile-specific authentication features that provides:
- Mobile platform detection
- Network state monitoring
- App state change handling
- Mobile-optimized user profiles

## Usage

### Basic Authentication

```typescript
import { useAuth } from '@/lib/auth';

const { isSignedIn, user, signIn, signOut, isLoading, error } = useAuth();

// Sign in
const handleSignIn = async () => {
  const success = await signIn(email.value, password.value);
  if (success) {
    // User is signed in
  }
};

// Sign out
const handleSignOut = async () => {
  await signOut();
};
```

### Form Components

```typescript
import { useAuth } from '@/lib/auth';

const {
  email,
  password,
  confirmPassword,
  isSignUpMode,
  isLoading,
  error,
  toggleMode,
  handleSubmit,
} = useAuth();
```

### Mobile Features

```typescript
import { useMobileAuth } from '@/lib/auth';

const { isMobile, isOnline, isAppActive, getMobileProfile } = useMobileAuth();
```

## Integration

### 1. Install Dependencies

```bash
npm install @clerk/vue @ionic/vue
```

### 2. Set up Clerk in main.ts

```typescript
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { clerkPlugin } from '@clerk/vue';
import App from './App.vue';

const app = createApp(App)
  .use(IonicVue)
  .use(clerkPlugin, {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  });

app.mount('#app');
```

### 3. Use in Components

```vue
<template>
  <div>
    <div v-if="!isSignedIn">
      <ion-input v-model="email" type="email" placeholder="Email" />
      <ion-input v-model="password" type="password" placeholder="Password" />
      <ion-button @click="handleSubmit" :disabled="isLoading">
        {{ isSignUpMode ? 'Sign Up' : 'Sign In' }}
      </ion-button>
    </div>
    <div v-else>
      <p>Welcome, {{ user?.firstName }}!</p>
      <ion-button @click="handleSignOut">Sign Out</ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/lib/auth';

const {
  isSignedIn,
  user,
  email,
  password,
  isSignUpMode,
  isLoading,
  handleSubmit,
  handleSignOut,
} = useAuth();
</script>
```

## Mobile Considerations

The library automatically handles mobile-specific challenges:

- **State Synchronization**: Uses `clerk.setActive()` to properly sync auth state
- **Network Monitoring**: Handles online/offline state changes
- **App State**: Monitors app focus/blur events
- **Token Management**: Handles JWT token refresh and validation

## Error Handling

All methods include comprehensive error handling:

- **User Feedback**: Automatic toast notifications for success/error states
- **Console Logging**: Detailed logging for debugging
- **Graceful Degradation**: Fallback behavior when errors occur

## TypeScript Support

The library is fully typed with TypeScript:

```typescript
// All methods are properly typed
const signIn = async (email: string, password: string): Promise<boolean> => {
  // Implementation
};

// State is reactive and typed
const isSignedIn: ComputedRef<boolean>;
const user: ComputedRef<User | null>;
const isLoading: ComputedRef<boolean>;
```

## Migration from Direct Clerk Usage

If you're migrating from direct Clerk usage:

1. **Replace direct imports**: Use the composables instead of `useClerk()` and `useUser()`
2. **Update method calls**: Use the consolidated methods instead of direct Clerk API calls
3. **Remove manual state management**: The library handles all state management automatically
4. **Update error handling**: Use the built-in error handling instead of manual try/catch blocks

## Best Practices

1. **Use the appropriate composable**: Choose the right composable for your use case
2. **Handle loading states**: Always check `isLoading` before showing UI
3. **Provide user feedback**: The library includes toast notifications, but you can add more
4. **Test on mobile**: Always test authentication flows on actual mobile devices
5. **Handle errors gracefully**: Use the error state to show appropriate messages to users

## Troubleshooting

### Common Issues

1. **State not updating**: Make sure you're using the reactive properties from the composables
2. **Mobile issues**: Check that you're using the mobile-specific composable for mobile features
3. **Token issues**: The library handles token management automatically, but check your Clerk configuration

### Debug Mode

Enable debug logging by checking the browser console. The library logs all authentication events and state changes.

## Contributing

When adding new features:

1. **Follow the existing patterns**: Use the same structure as existing composables
2. **Add TypeScript types**: Ensure all methods are properly typed
3. **Include error handling**: Add comprehensive error handling
4. **Add documentation**: Update this README with new features
5. **Test on mobile**: Ensure new features work on mobile devices
