---
type: "lesson"
title: "Development Environment Setup"
order: 2
published: 2025-09-04
draft: true
---

# Development Environment Setup

Before we can start building React Native apps, we need to set up our development environment. This lesson will guide you through installing all the necessary tools.

## Prerequisites

### System Requirements

**For iOS Development:**

- macOS (iOS development requires Xcode)
- Xcode 12 or newer
- iOS Simulator

**For Android Development:**

- Windows, macOS, or Linux
- Android Studio
- Android SDK
- Android Emulator or physical device

## Installation Options

React Native offers two main development approaches:

### 1. Expo CLI (Recommended for Beginners)

Expo is a platform that makes React Native development easier by providing:

- Zero-config setup
- Rich set of APIs
- Easy testing on devices
- Simplified deployment

### 2. React Native CLI

The official React Native CLI provides:

- Full access to native code
- Custom native modules
- More flexibility
- Direct platform integration

For this course, we'll start with **Expo CLI** for simplicity, then cover React Native CLI for advanced scenarios.

## Setting Up Expo Development Environment

### Step 1: Install Node.js

Download and install Node.js (version 14 or newer) from [nodejs.org](https://nodejs.org/).

Verify installation:

```bash
node --version
npm --version
```

### Step 2: Install Expo CLI

```bash
npm install -g @expo/cli
```

Verify installation:

```bash
expo --version
```

### Step 3: Install Expo Go App

Download Expo Go on your mobile device:

- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 4: Create Your First Project

```bash
# Create a new project
expo init MyFirstApp

# Navigate to project directory
cd MyFirstApp

# Start the development server
expo start
```

## Setting Up React Native CLI Environment

For more advanced development, you'll need the full React Native CLI setup.

### macOS Setup (iOS + Android)

#### 1. Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install Required Tools

```bash
# Install Node.js and Watchman
brew install node
brew install watchman

# Install React Native CLI
npm install -g react-native-cli
```

#### 3. iOS Setup

```bash
# Install Xcode from App Store
# Install Xcode Command Line Tools
sudo xcode-select --install

# Install CocoaPods
sudo gem install cocoapods
```

#### 4. Android Setup

**Install Android Studio:**

1. Download from [developer.android.com](https://developer.android.com/studio)
2. Follow installation wizard
3. Install Android SDK, SDK Platform, and Android Virtual Device

**Configure Environment Variables:**

```bash
# Add to ~/.zshrc or ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Windows Setup (Android Only)

#### 1. Install Required Software

- Node.js (LTS version)
- Python 3
- JDK 11 or newer
- Android Studio

#### 2. Install React Native CLI

```bash
npm install -g react-native-cli
```

#### 3. Configure Environment Variables

Add these to your system environment variables:

- `ANDROID_HOME`: Path to Android SDK
- `JAVA_HOME`: Path to JDK installation

### Linux Setup (Android Only)

#### 1. Install Node.js

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Install JDK

```bash
sudo apt update
sudo apt install openjdk-11-jdk
```

#### 3. Install Android Studio

Download and install from [developer.android.com](https://developer.android.com/studio)

## Code Editor Setup

### Visual Studio Code (Recommended)

Install useful extensions:

- **React Native Tools**: IntelliSense, debugging
- **ES7+ React/Redux/React-Native snippets**: Code snippets
- **Prettier**: Code formatting
- **Bracket Pair Colorizer**: Better bracket visualization
- **Auto Rename Tag**: Automatic tag renaming

### Alternative Editors

- **WebStorm**: Full-featured IDE with React Native support
- **Atom**: Lightweight with React Native packages
- **Sublime Text**: Fast editor with React Native plugins

## Testing Your Setup

### Expo CLI Test

```bash
# Create and run a test project
expo init TestApp
cd TestApp
expo start
```

### React Native CLI Test

```bash
# Create and run a test project
npx react-native init TestApp
cd TestApp

# For iOS (macOS only)
npx react-native run-ios

# For Android
npx react-native run-android
```

## Common Issues and Solutions

### Node.js Version Issues

```bash
# Use nvm to manage Node.js versions
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Android Emulator Issues

- Ensure virtualization is enabled in BIOS
- Allocate sufficient RAM (4GB+)
- Enable hardware acceleration

### iOS Simulator Issues

- Ensure Xcode is fully installed
- Accept Xcode license: `sudo xcodebuild -license accept`
- Install iOS simulators through Xcode

### Permission Issues (macOS/Linux)

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

## Verification Checklist

Before proceeding, ensure you have:

- [ ] Node.js installed and working
- [ ] Expo CLI installed (for Expo workflow)
- [ ] React Native CLI installed (for native workflow)
- [ ] Mobile device with Expo Go app OR emulator/simulator
- [ ] Code editor with React Native extensions
- [ ] Successfully created and run a test project

## Next Steps

Now that your development environment is ready, we'll create your first React Native app and explore the project structure. This foundation will serve you throughout the rest of the course.

Ready to build your first app? Let's go!
