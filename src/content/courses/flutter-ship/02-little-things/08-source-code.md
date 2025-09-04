---
type: "lesson"
title: "Source Code"
order: 8
published: 2025-09-03
draft: true
---e: "lesson"
title: "Source Code"
order: 5
published: 2025-09-03
draft: false
---

# Source Code

Access the complete source code and examples for the Little Things That Matter Most section.

## Repository Structure

This section's examples and configurations can be found in the course repository:

```
flutter-ship-examples/
├── little-things/
│   ├── analysis_options.yaml
│   ├── lib/
│   │   ├── flavors.dart
│   │   ├── main.dart
│   │   ├── main_dev.dart
│   │   ├── main_staging.dart
│   │   └── main_prod.dart
│   ├── android/
│   │   └── app/
│   │       ├── build.gradle
│   │       └── src/
│   │           ├── dev/
│   │           ├── staging/
│   │           └── prod/
│   ├── ios/
│   │   └── Flutter/
│   │       ├── Dev.xcconfig
│   │       ├── Staging.xcconfig
│   │       └── Prod.xcconfig
│   ├── .vscode/
│   │   └── launch.json
│   └── scripts/
│       ├── build-all-flavors.sh
│       └── setup-environment.sh
```

## Quick Setup

Clone the examples repository and navigate to the little-things section:

```bash
git clone https://github.com/flutter-ship/examples.git
cd examples/little-things
```

### Install Dependencies

```bash
# Install Flutter dependencies
flutter pub get

# Install development tools
dart pub global activate dart_code_metrics
dart pub global activate change_app_package_name
```

### Setup Your Project

```bash
# Run the setup script
chmod +x scripts/setup-environment.sh
./scripts/setup-environment.sh
```

## Files Overview

### Linting and Formatting

- **`analysis_options.yaml`**: Comprehensive linting rules and analyzer configuration
- **`.dart_tool/package_config.json`**: Auto-generated package configuration

### Flavors Configuration

- **`lib/flavors.dart`**: Flavor definitions and configuration
- **`lib/main_*.dart`**: Entry points for different flavors
- **`android/app/build.gradle`**: Android flavor configuration
- **`ios/Flutter/*.xcconfig`**: iOS configuration files

### Development Tools

- **`.vscode/launch.json`**: VS Code debug configurations for each flavor
- **`scripts/`**: Utility scripts for building and setup

## Code Examples

### Complete Flavor Implementation

**Flavor Configuration**: `lib/flavors.dart`

```dart
enum Flavor { dev, staging, prod }

class FlavorConfig {
  static Flavor? appFlavor;

  static String get name => appFlavor?.name ?? '';

  static String get title {
    switch (appFlavor) {
      case Flavor.dev:
        return 'Little Things Dev';
      case Flavor.staging:
        return 'Little Things Staging';
      case Flavor.prod:
        return 'Little Things';
      default:
        return 'Little Things';
    }
  }

  static FlavorValues get values {
    switch (appFlavor) {
      case Flavor.dev:
        return FlavorValues(
          baseUrl: 'https://dev-api.example.com',
          enableLogging: true,
          enableCrashlytics: false,
        );
      case Flavor.staging:
        return FlavorValues(
          baseUrl: 'https://staging-api.example.com',
          enableLogging: true,
          enableCrashlytics: true,
        );
      case Flavor.prod:
        return FlavorValues(
          baseUrl: 'https://api.example.com',
          enableLogging: false,
          enableCrashlytics: true,
        );
      default:
        return FlavorValues(
          baseUrl: '',
          enableLogging: false,
          enableCrashlytics: false,
        );
    }
  }
}

class FlavorValues {
  const FlavorValues({
    required this.baseUrl,
    required this.enableLogging,
    required this.enableCrashlytics,
  });

  final String baseUrl;
  final bool enableLogging;
  final bool enableCrashlytics;
}
```

### Package Name Configuration

**Android**: `android/app/build.gradle`

```gradle
android {
    compileSdkVersion flutter.compileSdkVersion

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
            applicationId "com.fluttership.littlethings.dev"
            versionNameSuffix "-dev"
            resValue "string", "app_name", "Little Things Dev"
        }

        staging {
            dimension "environment"
            applicationId "com.fluttership.littlethings.staging"
            versionNameSuffix "-staging"
            resValue "string", "app_name", "Little Things Staging"
        }

        prod {
            dimension "environment"
            applicationId "com.fluttership.littlethings"
            resValue "string", "app_name", "Little Things"
        }
    }
}
```

### Comprehensive Linting Rules

**Analysis Options**: `analysis_options.yaml`

```yaml
include: package:flutter_lints/flutter.yaml

analyzer:
  exclude:
    - "**/*.g.dart"
    - "**/*.freezed.dart"
    - "build/**"
  strong-mode:
    implicit-casts: false
    implicit-dynamic: false

linter:
  rules:
    # Error prevention
    - avoid_print
    - avoid_unnecessary_containers
    - prefer_const_constructors
    - prefer_const_literals_to_create_immutables
    - prefer_const_declarations

    # Style
    - camel_case_types
    - library_names
    - file_names
    - constant_identifier_names

    # Documentation
    - public_member_api_docs
    - package_api_docs

    # Performance
    - avoid_function_literals_in_foreach_calls
    - prefer_final_in_for_each
    - prefer_final_locals

    # Best practices
    - always_declare_return_types
    - avoid_empty_else
    - avoid_relative_lib_imports
    - prefer_single_quotes
    - sort_constructors_first
    - sort_unnamed_constructors_first
```

## Build Scripts

### Build All Flavors Script

**File**: `scripts/build-all-flavors.sh`

```bash
#!/bin/bash

echo "Building all flavors..."

# Clean previous builds
flutter clean
flutter pub get

# Build Android
echo "Building Android flavors..."
flutter build apk --flavor dev --target lib/main_dev.dart
flutter build apk --flavor staging --target lib/main_staging.dart
flutter build apk --flavor prod --target lib/main_prod.dart

# Build iOS (requires macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Building iOS flavors..."
    flutter build ios --flavor dev --target lib/main_dev.dart --no-codesign
    flutter build ios --flavor staging --target lib/main_staging.dart --no-codesign
    flutter build ios --flavor prod --target lib/main_prod.dart --no-codesign
fi

echo "✅ All builds completed!"
echo "📁 APK files are in: build/app/outputs/flutter-apk/"
```

### Environment Setup Script

**File**: `scripts/setup-environment.sh`

```bash
#!/bin/bash

echo "Setting up development environment..."

# Install global packages
echo "Installing global Dart packages..."
dart pub global activate dart_code_metrics
dart pub global activate change_app_package_name

# Setup git hooks
echo "Setting up git hooks..."
if [ -d ".git" ]; then
    cp scripts/git-hooks/* .git/hooks/
    chmod +x .git/hooks/*
    echo "✅ Git hooks installed"
else
    echo "⚠️  Not a git repository, skipping git hooks"
fi

# Install project dependencies
echo "Installing project dependencies..."
flutter pub get

# Run initial code analysis
echo "Running initial code analysis..."
flutter analyze

echo "✅ Environment setup completed!"
echo ""
echo "🚀 Ready to start development!"
echo "   - Run 'flutter run --flavor dev -t lib/main_dev.dart' for development"
echo "   - Use VS Code launch configurations for easy debugging"
echo "   - Run './scripts/build-all-flavors.sh' to build all flavors"
```

## VS Code Configuration

**Launch Configurations**: `.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Dev Flavor",
      "request": "launch",
      "type": "dart",
      "program": "lib/main_dev.dart",
      "args": ["--flavor", "dev"],
      "deviceId": "all"
    },
    {
      "name": "Staging Flavor",
      "request": "launch",
      "type": "dart",
      "program": "lib/main_staging.dart",
      "args": ["--flavor", "staging"],
      "deviceId": "all"
    },
    {
      "name": "Production Flavor",
      "request": "launch",
      "type": "dart",
      "program": "lib/main_prod.dart",
      "args": ["--flavor", "prod"],
      "deviceId": "all"
    }
  ]
}
```

**Settings**: `.vscode/settings.json`

```json
{
  "dart.lineLength": 80,
  "editor.formatOnSave": true,
  "editor.formatOnType": true,
  "dart.analysisServerFolding": true,
  "dart.previewCommitCharacters": true,
  "files.associations": {
    "*.dart": "dart"
  }
}
```

## Testing Your Setup

### Verify Package Names

```bash
# Check Android package names
grep -r "applicationId" android/app/build.gradle

# Check iOS bundle IDs
grep -r "PRODUCT_BUNDLE_IDENTIFIER" ios/
```

### Test Flavors

```bash
# Test each flavor builds successfully
flutter build apk --flavor dev -t lib/main_dev.dart
flutter build apk --flavor staging -t lib/main_staging.dart
flutter build apk --flavor prod -t lib/main_prod.dart
```

### Verify Linting

```bash
# Run comprehensive analysis
flutter analyze --fatal-warnings

# Check formatting
dart format --set-exit-if-changed .

# Run code metrics (if installed)
dart run dart_code_metrics:metrics analyze lib
```

## Getting Help

- **Course Discussions**: [GitHub Discussions](https://github.com/flutter-ship/discussions)
- **Example Issues**: [Report issues with examples](https://github.com/flutter-ship/examples/issues)
- **Community**: [Join our Discord](https://discord.gg/flutter-ship)

## Next Steps

With your project properly configured:

1. **Practice** building different flavors
2. **Customize** configurations for your specific needs
3. **Set up CI/CD** pipelines for automated builds
4. **Train your team** on the new development workflow

Ready for the next course section! 🚀
