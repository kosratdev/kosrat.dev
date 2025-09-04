---
type: "lesson"
title: "Package Name & Bundle ID"
order: 3
published: 2025-09-03
draft: false
---

# Package Name & Bundle ID

Learn how to properly configure and manage your Flutter app's package name and bundle ID for different platforms and environments.

## Understanding Package Names

### Android Package Name

The Android package name (also called Application ID) uniquely identifies your app on Google Play Store and Android devices.

**Format**: `com.company.appname`
**Example**: `com.fluttership.todoapp`

### iOS Bundle ID

The iOS Bundle Identifier serves the same purpose for iOS apps on the App Store.

**Format**: Same as Android package name
**Example**: `com.fluttership.todoapp`

## Setting Up Package Names

### Initial Configuration

When creating a new Flutter project:

```bash
flutter create --org com.yourcompany your_app_name
```

This creates a project with:

- Android package: `com.yourcompany.your_app_name`
- iOS bundle ID: `com.yourcompany.yourAppName`

### Manual Configuration

#### Android Configuration

**File**: `android/app/build.gradle`

```gradle
android {
    compileSdkVersion flutter.compileSdkVersion
    ndkVersion flutter.ndkVersion

    defaultConfig {
        applicationId "com.fluttership.todoapp"
        minSdkVersion flutter.minSdkVersion
        targetSdkVersion flutter.targetSdkVersion
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }
}
```

**File**: `android/app/src/main/AndroidManifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.fluttership.todoapp">

    <application
        android:label="Todo App"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <!-- ... -->
    </application>
</manifest>
```

#### iOS Configuration

**File**: `ios/Runner.xcodeproj/project.pbxproj`

Search for `PRODUCT_BUNDLE_IDENTIFIER` and update:

```
PRODUCT_BUNDLE_IDENTIFIER = com.fluttership.todoapp;
```

**File**: `ios/Runner/Info.plist`

```xml
<key>CFBundleIdentifier</key>
<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
```

## Environment-Specific Package Names

### Development vs Production

Use different package names for different environments:

- **Development**: `com.fluttership.todoapp.dev`
- **Staging**: `com.fluttership.todoapp.staging`
- **Production**: `com.fluttership.todoapp`

### Flavors Configuration

**File**: `android/app/build.gradle`

```gradle
android {
    flavorDimensions "environment"

    productFlavors {
        dev {
            dimension "environment"
            applicationId "com.fluttership.todoapp.dev"
            versionNameSuffix "-dev"
        }

        staging {
            dimension "environment"
            applicationId "com.fluttership.todoapp.staging"
            versionNameSuffix "-staging"
        }

        prod {
            dimension "environment"
            applicationId "com.fluttership.todoapp"
        }
    }
}
```

**File**: `ios/Runner/Info.plist`

Use configuration-specific bundle IDs:

```xml
<key>CFBundleIdentifier</key>
<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
```

Then configure in Xcode:

- Debug: `com.fluttership.todoapp.dev`
- Release: `com.fluttership.todoapp`

## Package Name Best Practices

### Naming Conventions

1. **Reverse domain notation**: Start with your domain in reverse
2. **Lowercase only**: Use only lowercase letters
3. **No special characters**: Only letters, numbers, and dots/underscores
4. **Descriptive**: Include meaningful app name
5. **Consistent**: Keep the same base across platforms

### Examples

✅ **Good Examples**:

- `com.spotify.music`
- `com.airbnb.android`
- `com.google.chrome`
- `org.mozilla.firefox`

❌ **Bad Examples**:

- `com.MyApp` (uppercase)
- `myapp` (no domain)
- `com.company.app-name` (hyphens)
- `com.123company.app` (starts with number)

## Changing Package Names

### Tools for Renaming

Use the `change_app_package_name` package for easy renaming:

```bash
flutter pub global activate change_app_package_name

# Change package name
flutter pub global run change_app_package_name:main com.newcompany.newappname
```

### Manual Steps

1. **Update build.gradle** files
2. **Update AndroidManifest.xml**
3. **Update iOS configuration**
4. **Move Kotlin/Java files** to new package structure
5. **Update imports** in native code
6. **Clean and rebuild** the project

### Verification Checklist

After changing package names:

- [ ] Android builds successfully
- [ ] iOS builds successfully
- [ ] Deep links still work
- [ ] Push notifications work
- [ ] Firebase configuration updated
- [ ] App signing configurations updated
- [ ] Store listings can be updated

## Platform-Specific Considerations

### Android

- **Google Play Console**: Package name cannot be changed once published
- **App Signing**: Key store must match package name
- **Firebase**: Update `google-services.json`
- **Deep Links**: Update intent filters

### iOS

- **App Store Connect**: Bundle ID cannot be changed once used
- **Provisioning Profiles**: Must match bundle ID exactly
- **Firebase**: Update `GoogleService-Info.plist`
- **Universal Links**: Update associated domains

## Firebase Integration

When using Firebase, update configuration files:

### Android

**File**: `android/app/google-services.json`

```json
{
  "project_info": {
    "project_number": "123456789",
    "project_id": "flutter-ship-todo"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:123456789:android:abc123",
        "android_client_info": {
          "package_name": "com.fluttership.todoapp"
        }
      }
    }
  ]
}
```

### iOS

**File**: `ios/Runner/GoogleService-Info.plist`

```xml
<key>BUNDLE_ID</key>
<string>com.fluttership.todoapp</string>
```

## Troubleshooting

### Common Issues

1. **Build failures after rename**: Clean build directories
2. **Firebase not working**: Update configuration files
3. **Deep links broken**: Update URL schemes
4. **App not installing**: Check for package conflicts

### Solutions

```bash
# Clean everything
flutter clean
cd android && ./gradlew clean && cd ..
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Rebuild
flutter pub get
flutter build apk  # or ios
```

## Security Considerations

- **Unique naming**: Avoid common names that could be squatted
- **Domain ownership**: Only use domains you own
- **Environment separation**: Use different IDs for dev/prod
- **Key management**: Keep signing keys secure and backed up
