---
type: "lesson"
title: "Creating Your First App"
order: 3
published: 2025-09-04
draft: true
---

# Creating Your First App

Now that your development environment is set up, let's create your first React Native application and get it running on your device or emulator.

## Creating a New Project

We'll create a simple "Hello World" app to verify everything is working correctly.

### Using Expo CLI

```bash
# Create a new Expo project
expo init HelloWorldApp

# Choose a template when prompted:
# - Blank: Minimal setup
# - Blank (TypeScript): Minimal setup with TypeScript
# - Tabs: App with tab navigation
```

For this lesson, choose the **Blank** template.

```bash
# Navigate to your project
cd HelloWorldApp

# Start the development server
expo start
```

### Using React Native CLI

```bash
# Create a new React Native project
npx react-native init HelloWorldApp

# Navigate to your project
cd HelloWorldApp

# Start Metro bundler
npx react-native start

# In another terminal, run the app
# For iOS (macOS only):
npx react-native run-ios

# For Android:
npx react-native run-android
```

## Running Your App

### On a Physical Device (Expo)

1. **Start the development server**:

   ```bash
   expo start
   ```

2. **Scan the QR code**:

   - **iOS**: Use the Camera app to scan the QR code
   - **Android**: Use the Expo Go app to scan the QR code

3. **Your app should load** on your device within a few seconds

### On an Emulator/Simulator

#### iOS Simulator (macOS only)

```bash
# Start with iOS simulator
expo start --ios

# Or for React Native CLI
npx react-native run-ios
```

#### Android Emulator

```bash
# Make sure emulator is running, then:
expo start --android

# Or for React Native CLI
npx react-native run-android
```

## Understanding the Generated Code

Let's examine the default code created by our project.

### App.js (Expo) / App.tsx (React Native CLI)

```javascript
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
```

### Breaking Down the Code

#### Imports

```javascript
import React from "react";
import { StyleSheet, Text, View } from "react-native";
```

- **React**: The core React library
- **StyleSheet**: For creating optimized styles
- **Text**: Component for displaying text
- **View**: Container component (like a `div` in web development)

#### Component Definition

```javascript
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
    </View>
  );
}
```

- **Function component**: Modern React pattern using hooks
- **JSX**: JavaScript XML syntax for describing UI
- **View**: Root container for our app
- **Text**: Displays "Hello World!" message

#### Styling

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
```

- **StyleSheet.create**: Optimizes styles for performance
- **flex: 1**: Takes up all available space
- **alignItems/justifyContent**: Centers content (similar to CSS Flexbox)

## Making Your First Changes

Let's customize the app to make it your own!

### Update the Text

```javascript
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React Native!</Text>
      <Text style={styles.subtitle}>Your first mobile app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
```

### Add Interactive Elements

```javascript
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React Native!</Text>
      <Text style={styles.subtitle}>Your first mobile app</Text>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Count: {count}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>Tap me!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  counterContainer: {
    alignItems: "center",
  },
  counterText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
```

## Hot Reloading in Action

One of React Native's best features is **hot reloading**:

1. **Make a change** to your code
2. **Save the file**
3. **Watch your app update** instantly on your device/emulator

Try changing the button color or text and see the magic happen!

## Common First-Time Issues

### Metro Bundler Issues

```bash
# If you encounter bundling issues, try:
npx react-native start --reset-cache
```

### Device Not Found

- Ensure your device is connected via USB (Android)
- Enable USB debugging on Android devices
- Make sure iOS simulator is running (iOS)

### App Not Loading on Device

- Check that your computer and device are on the same WiFi network
- Disable firewall temporarily if needed
- Try restarting the Expo development server

### Build Errors

```bash
# Clean and rebuild (React Native CLI)
cd ios && xcodebuild clean && cd ..
cd android && ./gradlew clean && cd ..
```

## Development Workflow

### Typical Development Cycle

1. **Make code changes** in your editor
2. **Save files** (cmd/ctrl + s)
3. **App reloads automatically** on device
4. **Test your changes**
5. **Repeat**

### Useful Development Commands

```bash
# Reload app manually
r (in Metro bundler terminal)

# Open developer menu on device
# iOS: cmd + d (simulator) or shake device
# Android: cmd + m (emulator) or shake device

# Enable/disable hot reloading
# Access through developer menu
```

## Debugging Your First App

### Console Logs

```javascript
export default function App() {
  console.log('App component rendered');

  const handlePress = () => {
    console.log('Button pressed!');
    setCount(count + 1);
  };

  return (
    // ... your JSX
  );
}
```

### Developer Menu Options

- **Reload**: Refresh the app
- **Debug**: Open Chrome debugging tools
- **Hot Reloading**: Toggle automatic reloading
- **Live Reload**: Toggle full app reload on file changes

## Next Steps

Congratulations! You've successfully:

✅ Created your first React Native app  
✅ Run it on a device or emulator  
✅ Made your first code changes  
✅ Experienced hot reloading  
✅ Added interactive elements

In the next lesson, we'll dive deeper into the project structure and understand how React Native apps are organized.

## Exercise: Customize Your App

Before moving on, try these challenges:

1. **Change the background color** to your favorite color
2. **Add another button** that decreases the counter
3. **Add your name** to the welcome message
4. **Experiment with different font sizes** and styles

Take your time to explore and get comfortable with the development workflow. This foundation will serve you well throughout the rest of the course!
