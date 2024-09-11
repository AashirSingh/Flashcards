import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',  // Replace with your actual app ID if necessary
  appName: 'bookings',
  webDir: 'www',  // Make sure this matches your Ionic build output directory
  bundledWebRuntime: false,  // Set to true if you want to bundle the Capacitor runtime
  // Optional: Add server config for live reload during development (if needed)
  server: {
    cleartext: true  // Allow HTTP connections during development; set to false in production
  },
  // Optional: Add iOS or Android-specific configuration here
  ios: {
    contentInset: 'always',  // Example iOS-specific config (scrolling behavior)
  },
  android: {
    allowMixedContent: true  // Example Android-specific config (mixed HTTPS and HTTP)
  }
};

export default config;