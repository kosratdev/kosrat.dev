---
type: "lesson"
title: "Components and JSX"
order: 1
published: 2025-09-04
draft: true
---

# Components and JSX

Understanding components and JSX is fundamental to React Native development. In this lesson, we'll explore how to create, use, and organize components effectively.

## What are Components?

Components are the building blocks of React Native applications. They are reusable pieces of UI that can be composed together to create complex interfaces.

### Types of Components

#### 1. Functional Components (Recommended)

```javascript
import React from "react";
import { View, Text } from "react-native";

const WelcomeMessage = () => {
  return (
    <View>
      <Text>Welcome to React Native!</Text>
    </View>
  );
};

export default WelcomeMessage;
```

#### 2. Class Components (Legacy)

```javascript
import React, { Component } from "react-native";
import { View, Text } from "react-native";

class WelcomeMessage extends Component {
  render() {
    return (
      <View>
        <Text>Welcome to React Native!</Text>
      </View>
    );
  }
}

export default WelcomeMessage;
```

## JSX Fundamentals

JSX (JavaScript XML) is a syntax extension that allows you to write HTML-like markup in JavaScript.

### Basic JSX Rules

#### 1. Single Root Element

```javascript
// ✅ Correct - Single root element
const MyComponent = () => {
  return (
    <View>
      <Text>First element</Text>
      <Text>Second element</Text>
    </View>
  );
};

// ❌ Incorrect - Multiple root elements
const MyComponent = () => {
  return (
    <Text>First element</Text>
    <Text>Second element</Text>
  );
};
```

#### 2. Self-Closing Tags

```javascript
// ✅ Correct
<Image source={{uri: 'image.jpg'}} />
<TextInput placeholder="Enter text" />

// ❌ Incorrect
<Image source={{uri: 'image.jpg'}}>
<TextInput placeholder="Enter text">
```

#### 3. CamelCase Attributes

```javascript
// ✅ Correct
<View backgroundColor="#fff" borderRadius={10}>
  <Text fontSize={16} fontWeight="bold">Hello</Text>
</View>

// ❌ Incorrect (HTML style)
<View background-color="#fff" border-radius="10">
  <Text font-size="16" font-weight="bold">Hello</Text>
</View>
```

## Creating Custom Components

### Simple Component

```javascript
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UserCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.email}>john@example.com</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    margin: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
});

export default UserCard;
```

### Component with Props

```javascript
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UserCard = ({ name, email, avatar }) => {
  return (
    <View style={styles.card}>
      {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

// Usage
<UserCard
  name="John Doe"
  email="john@example.com"
  avatar="https://example.com/avatar.jpg"
/>;
```

## JSX Expressions and Logic

### Embedding JavaScript

```javascript
const UserGreeting = ({ userName, isLoggedIn }) => {
  const currentTime = new Date().toLocaleTimeString();

  return (
    <View>
      <Text>Current time: {currentTime}</Text>
      <Text>Welcome, {userName}!</Text>
      <Text>Status: {isLoggedIn ? "Online" : "Offline"}</Text>
    </View>
  );
};
```

### Conditional Rendering

```javascript
const MessageList = ({ messages, isLoading }) => {
  return (
    <View>
      {isLoading ? (
        <Text>Loading messages...</Text>
      ) : (
        <View>
          {messages.length > 0 ? (
            messages.map((message) => (
              <Text key={message.id}>{message.text}</Text>
            ))
          ) : (
            <Text>No messages found</Text>
          )}
        </View>
      )}
    </View>
  );
};
```

### Logical AND Operator

```javascript
const NotificationBadge = ({ count }) => {
  return (
    <View>
      <Text>Inbox</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
  );
};
```

## Component Composition

### Composing Components

```javascript
// Child Component
const ProfileImage = ({ imageUrl, size = 50 }) => (
  <Image
    source={{ uri: imageUrl }}
    style={{ width: size, height: size, borderRadius: size / 2 }}
  />
);

// Parent Component
const UserProfile = ({ user }) => {
  return (
    <View style={styles.container}>
      <ProfileImage imageUrl={user.avatar} size={80} />
      <View style={styles.details}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>
    </View>
  );
};
```

### Children Props

```javascript
const Card = ({ children, title }) => {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      {children}
    </View>
  );
};

// Usage
<Card title="User Information">
  <Text>Name: John Doe</Text>
  <Text>Email: john@example.com</Text>
  <Button title="Edit Profile" />
</Card>;
```

## React Native Core Components

### Essential Components

```javascript
import React from "react";
import {
  View, // Container
  Text, // Text display
  Image, // Images
  ScrollView, // Scrollable container
  TextInput, // Text input
  TouchableOpacity, // Touchable button
  FlatList, // Efficient lists
  StyleSheet, // Styling
} from "react-native";
```

### Component Example

```javascript
const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Contact Form</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
```

## Best Practices

### 1. Component Organization

```javascript
// Organize components by feature
components/
├── common/
│   ├── Button/
│   │   ├── Button.js
│   │   ├── Button.styles.js
│   │   └── index.js
│   └── Card/
├── user/
│   ├── UserProfile/
│   └── UserList/
```

### 2. Naming Conventions

```javascript
// ✅ Good - PascalCase for components
const UserProfile = () => { ... };
const MessageList = () => { ... };

// ✅ Good - camelCase for functions and variables
const handlePress = () => { ... };
const isVisible = true;

// ✅ Good - Descriptive names
const UserAvatarImage = () => { ... };
const LoadingSpinner = () => { ... };
```

### 3. Keep Components Small

```javascript
// ✅ Good - Single responsibility
const UserAvatar = ({ imageUrl, size }) => (
  <Image source={{ uri: imageUrl }} style={{ width: size, height: size }} />
);

const UserName = ({ name, style }) => (
  <Text style={[styles.name, style]}>{name}</Text>
);

const UserProfile = ({ user }) => (
  <View>
    <UserAvatar imageUrl={user.avatar} size={60} />
    <UserName name={user.name} />
  </View>
);
```

### 4. Use PropTypes or TypeScript

```javascript
import PropTypes from "prop-types";

const UserCard = ({ name, email, isOnline }) => {
  // component implementation
};

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isOnline: PropTypes.bool,
};

UserCard.defaultProps = {
  isOnline: false,
};
```

## Common Patterns

### 1. Container/Presenter Pattern

```javascript
// Container (logic)
const UserListContainer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return <UserListPresenter users={users} loading={loading} />;
};

// Presenter (UI)
const UserListPresenter = ({ users, loading }) => {
  if (loading) return <LoadingSpinner />;

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <UserCard user={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};
```

### 2. Higher-Order Components

```javascript
const withLoading = (WrappedComponent) => {
  return ({ isLoading, ...props }) => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    return <WrappedComponent {...props} />;
  };
};

// Usage
const EnhancedUserList = withLoading(UserList);
<EnhancedUserList isLoading={loading} users={users} />;
```

## Exercise: Build a Profile Card

Create a reusable ProfileCard component that displays:

- User avatar image
- Name and username
- Bio/description
- Follow button
- Social stats (followers, following)

```javascript
const ProfileCard = ({ user, onFollow, isFollowing }) => {
  // Implement your component here
};

// Usage example:
<ProfileCard
  user={{
    name: "Jane Doe",
    username: "@janedoe",
    bio: "React Native developer",
    avatar: "https://example.com/avatar.jpg",
    followers: 1250,
    following: 180,
  }}
  isFollowing={false}
  onFollow={() => console.log("Follow pressed")}
/>;
```

## Summary

In this lesson, you learned:

✅ **Component fundamentals** - Functional vs class components  
✅ **JSX syntax** - Rules and best practices  
✅ **Component composition** - Building complex UIs from simple components  
✅ **Props and children** - Passing data between components  
✅ **Conditional rendering** - Showing/hiding content based on state  
✅ **Best practices** - Organization, naming, and patterns

Next, we'll dive into state management and props to make our components interactive and dynamic!
