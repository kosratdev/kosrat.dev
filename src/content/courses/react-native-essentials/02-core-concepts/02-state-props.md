---
type: "lesson"
title: "State and Props"
order: 2
published: 2025-09-04
draft: true
---

# State and Props

State and props are fundamental concepts in React Native that allow you to create dynamic, interactive applications. Understanding these concepts is crucial for building effective mobile apps.

## Understanding Props

Props (short for "properties") are read-only data passed from parent components to child components.

### Basic Props Usage

```javascript
// Child Component
const Greeting = ({ name, age }) => {
  return (
    <View>
      <Text>Hello, {name}!</Text>
      <Text>You are {age} years old.</Text>
    </View>
  );
};

// Parent Component
const App = () => {
  return (
    <View>
      <Greeting name="Alice" age={25} />
      <Greeting name="Bob" age={30} />
    </View>
  );
};
```

### Props Destructuring

```javascript
// With destructuring (recommended)
const UserCard = ({ name, email, isOnline }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      <View
        style={[styles.status, isOnline ? styles.online : styles.offline]}
      />
    </View>
  );
};

// Without destructuring
const UserCard = (props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{props.name}</Text>
      <Text style={styles.email}>{props.email}</Text>
      <View
        style={[styles.status, props.isOnline ? styles.online : styles.offline]}
      />
    </View>
  );
};
```

### Default Props

```javascript
const Button = ({ title, color, size, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color },
        styles[size]
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// Set default props
Button.defaultProps = {
  color: '#007AFF',
  size: 'medium',
  title: 'Button',
};

// Usage - only pass props that differ from defaults
<Button title="Save" onPress={handleSave} />
<Button title="Delete" color="#FF3B30" size="large" onPress={handleDelete} />
```

## Understanding State

State is mutable data that belongs to a component and can change over time, causing the component to re-render.

### useState Hook

```javascript
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Counter = () => {
  // Declare state variable with initial value
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>Count: {count}</Text>
      <TouchableOpacity onPress={() => setCount(count + 1)}>
        <Text>Increment</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCount(count - 1)}>
        <Text>Decrement</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Multiple State Variables

```javascript
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      await login(email, password);
    } catch (error) {
      setErrors({ general: "Login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      {errors.general && <Text style={styles.error}>{errors.general}</Text>}

      <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
        <Text>{isLoading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## State with Objects and Arrays

### Object State

```javascript
const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    preferences: {
      notifications: true,
      darkMode: false,
    },
  });

  const updateName = (newName) => {
    setUser((prevUser) => ({
      ...prevUser,
      name: newName,
    }));
  };

  const updatePreference = (key, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        [key]: value,
      },
    }));
  };

  return (
    <View>
      <TextInput
        value={user.name}
        onChangeText={updateName}
        placeholder="Name"
      />

      <Switch
        value={user.preferences.notifications}
        onValueChange={(value) => updatePreference("notifications", value)}
      />
    </View>
  );
};
```

### Array State

```javascript
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos((prevTodos) => [
        ...prevTodos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
        },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <View>
      <TextInput
        value={newTodo}
        onChangeText={setNewTodo}
        placeholder="Add new todo"
      />
      <TouchableOpacity onPress={addTodo}>
        <Text>Add</Text>
      </TouchableOpacity>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity onPress={() => toggleTodo(item.id)}>
              <Text style={item.completed ? styles.completed : styles.active}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};
```

## Passing State as Props

### Parent-Child Communication

```javascript
// Parent Component
const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users] = useState([
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ]);

  return (
    <View>
      <UserList users={users} onSelectUser={setSelectedUser} />

      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </View>
  );
};

// Child Components
const UserList = ({ users, onSelectUser }) => (
  <FlatList
    data={users}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => onSelectUser(item)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    )}
  />
);

const UserDetails = ({ user, onClose }) => (
  <View>
    <Text>{user.name}</Text>
    <Text>{user.email}</Text>
    <TouchableOpacity onPress={onClose}>
      <Text>Close</Text>
    </TouchableOpacity>
  </View>
);
```

## Event Handling

### Basic Event Handlers

```javascript
const InteractiveButton = () => {
  const [pressed, setPressed] = useState(false);
  const [pressCount, setPressCount] = useState(0);

  const handlePress = () => {
    setPressCount((count) => count + 1);
  };

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, pressed && styles.buttonPressed]}
    >
      <Text>Pressed {pressCount} times</Text>
    </TouchableOpacity>
  );
};
```

### Form Handling

```javascript
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Reset form
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <View>
      <TextInput
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
        placeholder="Your Name"
        style={[styles.input, errors.name && styles.inputError]}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
        placeholder="Your Email"
        keyboardType="email-address"
        style={[styles.input, errors.email && styles.inputError]}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        value={formData.message}
        onChangeText={(value) => handleInputChange("message", value)}
        placeholder="Your Message"
        multiline
        numberOfLines={4}
        style={[
          styles.input,
          styles.textArea,
          errors.message && styles.inputError,
        ]}
      />
      {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## State Management Best Practices

### 1. Keep State Local

```javascript
// ✅ Good - State only in component that needs it
const SearchInput = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  return (
    <TextInput
      value={query}
      onChangeText={setQuery}
      onSubmitEditing={() => onSearch(query)}
    />
  );
};

// ❌ Avoid - Unnecessary state lifting
const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return <SearchInput query={searchQuery} onQueryChange={setSearchQuery} />;
};
```

### 2. Use Functional Updates

```javascript
// ✅ Good - Functional update
const incrementCounter = () => {
  setCount((prevCount) => prevCount + 1);
};

// ❌ Risky - Direct reference
const incrementCounter = () => {
  setCount(count + 1);
};
```

### 3. Minimize State

```javascript
// ✅ Good - Derive values instead of storing them
const ShoppingCart = ({ items }) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View>
      <Text>Items: {itemCount}</Text>
      <Text>Total: ${total.toFixed(2)}</Text>
    </View>
  );
};

// ❌ Avoid - Redundant state
const ShoppingCart = ({ items }) => {
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Complex useEffect to keep derived state in sync
  useEffect(() => {
    const newTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const newCount = items.reduce((sum, item) => sum + item.quantity, 0);
    setTotal(newTotal);
    setItemCount(newCount);
  }, [items]);
};
```

## Common Patterns

### Toggle State

```javascript
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
};

// Usage
const Modal = () => {
  const [isVisible, toggleVisible] = useToggle(false);

  return (
    <View>
      <TouchableOpacity onPress={toggleVisible}>
        <Text>Open Modal</Text>
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.modal}>
          <Text>Modal Content</Text>
          <TouchableOpacity onPress={toggleVisible}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
```

## Exercise: Build a Task Manager

Create a task manager component with the following features:

1. **Add new tasks**
2. **Mark tasks as complete/incomplete**
3. **Delete tasks**
4. **Filter tasks** (All, Active, Completed)
5. **Show task counts**

```javascript
const TaskManager = () => {
  // Implement your state and handlers here

  return (
    <View>
      {/* Add task input */}
      {/* Filter buttons */}
      {/* Task list */}
      {/* Task count summary */}
    </View>
  );
};
```

## Summary

In this lesson, you learned:

✅ **Props fundamentals** - Passing data between components  
✅ **State management** - Using useState hook effectively  
✅ **Event handling** - Responding to user interactions  
✅ **Form handling** - Managing form state and validation  
✅ **Best practices** - Keeping state local and using functional updates  
✅ **Common patterns** - Toggle state and derived values

Next, we'll explore styling and layout to make your components look great!
