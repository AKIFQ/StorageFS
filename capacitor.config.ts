import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.storagefs.app',
  appName: 'StorageFS',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    Camera: {
      ios: {
        permissions: [
          'camera',
          'photos'
        ]
      },
      android: {
        permissions: [
          'android.permission.CAMERA',
          'android.permission.READ_EXTERNAL_STORAGE',
          'android.permission.WRITE_EXTERNAL_STORAGE'
        ]
      }
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
