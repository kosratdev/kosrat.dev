---
type: "lesson"
title: "Flavors"
order: 4
published: 2025-09-03
draft: true
---

# Flavors

Learn how to set up and manage different app flavors for development, staging, and production environments in Flutter.

## What are Flavors?

Flavors (also called build variants) allow you to create multiple versions of your app from the same codebase with different configurations, such as:

- Different API endpoints
- Different app names and icons
- Different package names
- Different feature sets
- Different analytics configurations

## Common Flavor Setup

Typically, you'll want these flavors:

- **Development**: For local development and testing
- **Staging**: For QA testing with production-like environment
- **Production**: The live app distributed to users

## Android Flavor Configuration

### 1. Configure build.gradle

**File**: `android/app/build.gradle`

```gradle
android {
    compileSdkVersion flutter.compileSdkVersion
    ndkVersion flutter.ndkVersion

    defaultConfig {
        minSdkVersion flutter.minSdkVersion
        targetSdkVersion flutter.targetSdkVersion
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }

    flavorDimensions "environment"

    productFlavors {
        dev {
            dimension "environment"
            applicationId "com.fluttership.todoapp.dev"
            versionNameSuffix "-dev"
            resValue "string", "app_name", "TodoApp Dev"
        }

        staging {
            dimension "environment"
            applicationId "com.fluttership.todoapp.staging"
            versionNameSuffix "-staging"
            resValue "string", "app_name", "TodoApp Staging"
        }

        prod {
            dimension "environment"
            applicationId "com.fluttership.todoapp"
            resValue "string", "app_name", "TodoApp"
        }
    }

    buildTypes {
        debug {
            debuggable true
        }

        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 2. Update AndroidManifest.xml

**File**: `android/app/src/main/AndroidManifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.fluttership.todoapp">

    <application
        android:label="@string/app_name"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <!-- Rest of configuration -->
    </application>
</manifest>
```

### 3. Create Flavor-Specific Resources

Create directories for each flavor:

```
android/app/src/
├── main/
├── dev/
│   ├── res/
│   │   ├── mipmap-*/
│   │   │   └── ic_launcher.png (dev icon)
│   │   └── values/
│   │       └── strings.xml
│   └── google-services.json
├── staging/
│   ├── res/
│   │   ├── mipmap-*/
│   │   │   └── ic_launcher.png (staging icon)
│   │   └── values/
│   │       └── strings.xml
│   └── google-services.json
└── prod/
    ├── res/
    │   ├── mipmap-*/
    │   │   └── ic_launcher.png (prod icon)
    │   └── values/
    │       └── strings.xml
    └── google-services.json
```

## iOS Flavor Configuration

### 1. Create Schemes in Xcode

1. Open `ios/Runner.xcworkspace` in Xcode
2. Click on the scheme dropdown → "Manage Schemes"
3. Duplicate the "Runner" scheme for each flavor
4. Rename schemes: "Runner-Dev", "Runner-Staging", "Runner-Prod"

### 2. Create Build Configurations

1. In Project Navigator, select "Runner" project
2. Go to "Info" tab
3. Duplicate "Debug" and "Release" configurations:
   - Debug-Dev, Release-Dev
   - Debug-Staging, Release-Staging
   - Debug-Prod, Release-Prod

### 3. Configure Bundle Identifiers

For each configuration, set different bundle IDs:

- **Dev**: `com.fluttership.todoapp.dev`
- **Staging**: `com.fluttership.todoapp.staging`
- **Prod**: `com.fluttership.todoapp`

### 4. Create Configuration Files

**File**: `ios/Flutter/Dev.xcconfig`

```
#include "Generated.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = com.fluttership.todoapp.dev
PRODUCT_NAME = TodoApp Dev
ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon-Dev
```

**File**: `ios/Flutter/Staging.xcconfig`

```
#include "Generated.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = com.fluttership.todoapp.staging
PRODUCT_NAME = TodoApp Staging
ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon-Staging
```

**File**: `ios/Flutter/Prod.xcconfig`

```
#include "Generated.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = com.fluttership.todoapp
PRODUCT_NAME = TodoApp
ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon
```

## Flutter Flavor Configuration

### 1. Define Flavor Constants

**File**: `lib/flavors.dart`

```dart
enum Flavor {
  dev,
  staging,
  prod,
}

class FlavorValues {
  FlavorValues({
    required this.baseUrl,
    required this.analyticsEnabled,
    required this.crashlyticsEnabled,
  });

  final String baseUrl;
  final bool analyticsEnabled;
  final bool crashlyticsEnabled;
}

class FlavorConfig {
  static Flavor? appFlavor;

  static String get name => appFlavor?.name ?? '';

  static String get title {
    switch (appFlavor) {
      case Flavor.dev:
        return 'TodoApp Dev';
      case Flavor.staging:
        return 'TodoApp Staging';
      case Flavor.prod:
        return 'TodoApp';
      default:
        return 'title';
    }
  }

  static FlavorValues get values {
    switch (appFlavor) {
      case Flavor.dev:
        return FlavorValues(
          baseUrl: 'https://dev-api.todoapp.com',
          analyticsEnabled: false,
          crashlyticsEnabled: false,
        );
      case Flavor.staging:
        return FlavorValues(
          baseUrl: 'https://staging-api.todoapp.com',
          analyticsEnabled: true,
          crashlyticsEnabled: true,
        );
      case Flavor.prod:
        return FlavorValues(
          baseUrl: 'https://api.todoapp.com',
          analyticsEnabled: true,
          crashlyticsEnabled: true,
        );
      default:
        return FlavorValues(
          baseUrl: '',
          analyticsEnabled: false,
          crashlyticsEnabled: false,
        );
    }
  }
}
```

### 2. Create Flavor Entry Points

**File**: `lib/main_dev.dart`

```dart
import 'package:flutter/material.dart';
import 'flavors.dart';
import 'main.dart';

void main() {
  FlavorConfig.appFlavor = Flavor.dev;
  mainApp();
}
```

**File**: `lib/main_staging.dart`

```dart
import 'package:flutter/material.dart';
import 'flavors.dart';
import 'main.dart';

void main() {
  FlavorConfig.appFlavor = Flavor.staging;
  mainApp();
}
```

**File**: `lib/main_prod.dart`

```dart
import 'package:flutter/material.dart';
import 'flavors.dart';
import 'main.dart';

void main() {
  FlavorConfig.appFlavor = Flavor.prod;
  mainApp();
}
```

**File**: `lib/main.dart`

```dart
import 'package:flutter/material.dart';
import 'flavors.dart';

void main() {
  FlavorConfig.appFlavor = Flavor.prod;
  mainApp();
}

void mainApp() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: FlavorConfig.title,
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlavorConfig.title),
      ),
      body: Center(
        child: Column(
          children: [
            Text('Flavor: ${FlavorConfig.name}'),
            Text('Base URL: ${FlavorConfig.values.baseUrl}'),
          ],
        ),
      ),
    );
  }
}
```

## Building Flavors

### Command Line

```bash
# Android
flutter build apk --flavor dev
flutter build apk --flavor staging
flutter build apk --flavor prod

# iOS
flutter build ios --flavor dev
flutter build ios --flavor staging
flutter build ios --flavor prod
```

### Running Flavors

```bash
# Run specific flavor
flutter run --flavor dev -t lib/main_dev.dart
flutter run --flavor staging -t lib/main_staging.dart
flutter run --flavor prod -t lib/main_prod.dart
```

## VS Code Launch Configuration

Create `.vscode/launch.json` for easy flavor switching:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Dev",
      "request": "launch",
      "type": "dart",
      "program": "lib/main_dev.dart",
      "args": ["--flavor", "dev"]
    },
    {
      "name": "Staging",
      "request": "launch",
      "type": "dart",
      "program": "lib/main_staging.dart",
      "args": ["--flavor", "staging"]
    },
    {
      "name": "Prod",
      "request": "launch",
      "type": "dart",
      "program": "lib/main_prod.dart",
      "args": ["--flavor", "prod"]
    }
  ]
}
```

## Advanced Flavor Features

### Environment Variables

```dart
class Environment {
  static const String apiKey = String.fromEnvironment('API_KEY');
  static const bool enableLogging = bool.fromEnvironment('ENABLE_LOGGING');
}
```

### Feature Flags

```dart
class FeatureFlags {
  static bool get newFeatureEnabled {
    switch (FlavorConfig.appFlavor) {
      case Flavor.dev:
        return true;
      case Flavor.staging:
        return true;
      case Flavor.prod:
        return false;
      default:
        return false;
    }
  }
}
```

### Different App Icons

Use different app icons for each flavor to easily distinguish between environments on your device.

## Best Practices

1. **Clear naming**: Use descriptive flavor names
2. **Consistent configuration**: Keep similar structure across flavors
3. **Environment separation**: Use different backend environments
4. **Feature flags**: Use flavors to control feature availability
5. **Analytics separation**: Use different analytics projects
6. **Security**: Don't include production keys in dev flavors

## Troubleshooting

### Common Issues

- **Gradle sync fails**: Check flavor configuration syntax
- **iOS build fails**: Verify scheme and configuration setup
- **App not installing**: Check for package name conflicts
- **Firebase not working**: Ensure correct configuration files for each flavor

### Solutions

```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter build apk --flavor dev
```
