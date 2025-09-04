---
type: "lesson"
title: "Let, Const, and Block Scope"
order: 1
published: 2025-09-04
draft: true
---

# Let, Const, and Block Scope

Welcome to JavaScript Modern Fundamentals! In this first lesson, we'll explore how `let` and `const` revolutionized variable declarations and introduced block scope to JavaScript.

## The Problem with `var`

Before ES6, JavaScript only had `var` for variable declarations, which came with several issues:

### Function Scope Issues

```javascript
function example() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 - var is function-scoped, not block-scoped
}

// This creates unexpected behavior
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Prints 3, 3, 3
}
```

### Hoisting Confusion

```javascript
console.log(x); // undefined (not an error, but confusing)
var x = 5;

// JavaScript interprets the above as:
var x;
console.log(x); // undefined
x = 5;
```

## Introducing `let`

`let` provides block scope and eliminates many of the issues with `var`.

### Block Scope

```javascript
function example() {
  if (true) {
    let x = 1;
    console.log(x); // 1
  }
  console.log(x); // ReferenceError: x is not defined
}

// Fixed loop behavior
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Prints 0, 1, 2
}
```

### Temporal Dead Zone

```javascript
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// Unlike var, let variables cannot be accessed before declaration
```

### No Re-declaration

```javascript
let name = "Alice";
let name = "Bob"; // SyntaxError: Identifier 'name' has already been declared

// But you can reassign
let name = "Alice";
name = "Bob"; // This is fine
```

## Introducing `const`

`const` creates block-scoped constants that cannot be reassigned.

### Basic Usage

```javascript
const PI = 3.14159;
const name = "Alice";

PI = 3.14; // TypeError: Assignment to constant variable
```

### Must Be Initialized

```javascript
const x; // SyntaxError: Missing initializer in const declaration
```

### Object and Array Constants

```javascript
// The reference is constant, but the content can be modified
const user = { name: "Alice", age: 25 };
user.age = 26; // This is allowed
user.city = "New York"; // This is allowed

const numbers = [1, 2, 3];
numbers.push(4); // This is allowed
numbers[0] = 10; // This is allowed

// But you cannot reassign the reference
user = { name: "Bob" }; // TypeError: Assignment to constant variable
numbers = [4, 5, 6]; // TypeError: Assignment to constant variable
```

### Preventing Object Mutation

```javascript
const user = Object.freeze({ name: "Alice", age: 25 });
user.age = 26; // Silently fails in non-strict mode, throws error in strict mode

// For deep freezing, you need a recursive solution
function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach((property) => {
    if (obj[property] && typeof obj[property] === "object") {
      deepFreeze(obj[property]);
    }
  });
  return Object.freeze(obj);
}
```

## Block Scope in Detail

### What Creates a Block?

```javascript
// if statements
if (true) {
  let x = 1; // Block scoped
}

// for loops
for (let i = 0; i < 5; i++) {
  let j = i * 2; // Block scoped
}

// while loops
while (condition) {
  let temp = getValue(); // Block scoped
}

// try-catch blocks
try {
  let result = riskyOperation(); // Block scoped
} catch (error) {
  let message = error.message; // Block scoped
}

// switch statements
switch (value) {
  case 1:
    let x = "one"; // Block scoped to entire switch
    break;
  case 2:
    let y = "two"; // Block scoped to entire switch
    break;
}

// Arbitrary blocks
{
  let blockScoped = "I'm only available in this block";
}
```

### Nested Scopes

```javascript
function outer() {
  let outerVar = "outer";

  if (true) {
    let innerVar = "inner";
    console.log(outerVar); // "outer" - can access outer scope

    {
      let deepVar = "deep";
      console.log(outerVar); // "outer"
      console.log(innerVar); // "inner"
      console.log(deepVar); // "deep"
    }

    console.log(deepVar); // ReferenceError: deepVar is not defined
  }

  console.log(innerVar); // ReferenceError: innerVar is not defined
}
```

## Practical Examples

### Loop Closures Fixed

```javascript
// The classic problem with var
var buttons = document.querySelectorAll("button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    console.log("Button " + i + " clicked"); // Always logs the last value of i
  });
}

// Fixed with let
const buttons = document.querySelectorAll("button");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    console.log("Button " + i + " clicked"); // Logs the correct value
  });
}
```

### Configuration Objects

```javascript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
  features: {
    authentication: true,
    caching: false,
    analytics: true,
  },
};

// You can modify properties but not reassign the entire object
config.timeout = 10000; // OK
config.features.caching = true; // OK
// config = {}; // TypeError
```

### Module-like Patterns

```javascript
const Calculator = (() => {
  // Private variables
  let history = [];

  // Private functions
  const log = (operation, result) => {
    history.push({ operation, result, timestamp: Date.now() });
  };

  // Public API
  return {
    add(a, b) {
      const result = a + b;
      log(`${a} + ${b}`, result);
      return result;
    },

    subtract(a, b) {
      const result = a - b;
      log(`${a} - ${b}`, result);
      return result;
    },

    getHistory() {
      return [...history]; // Return copy, not reference
    },

    clearHistory() {
      history = [];
    },
  };
})();
```

## Best Practices

### 1. Use `const` by Default

```javascript
// ✅ Good - Use const when the reference won't change
const users = [];
const config = { theme: "dark" };
const calculateTotal = (items) => {
  /* ... */
};

// ✅ OK - Use let when you need to reassign
let currentUser = null;
let attempts = 0;
```

### 2. Minimize Scope

```javascript
// ✅ Good - Declare variables as close to usage as possible
function processItems(items) {
  const results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.isValid) {
      const processed = processItem(item);
      results.push(processed);
    }
  }

  return results;
}
```

### 3. Avoid `var` in Modern JavaScript

```javascript
// ❌ Avoid
var globalVar = "problematic";

// ✅ Good
const globalConst = "better";
let globalLet = "acceptable when needed";
```

### 4. Use Descriptive Names

```javascript
// ❌ Poor naming
const d = new Date();
let u = getCurrentUser();

// ✅ Good naming
const currentDate = new Date();
let currentUser = getCurrentUser();
```

## Common Pitfalls

### 1. Const with Objects

```javascript
// ❌ Common misconception
const user = { name: "Alice" };
// People think this should fail:
user.name = "Bob"; // This actually works!

// ✅ Understanding: const prevents reassignment, not mutation
const user = { name: "Alice" };
user.name = "Bob"; // OK - modifying property
// user = { name: "Charlie" }; // Error - reassigning reference
```

### 2. Loop Variables

```javascript
// ❌ Problematic
for (const i = 0; i < 3; i++) {
  // TypeError: Assignment to constant variable
  console.log(i);
}

// ✅ Correct
for (let i = 0; i < 3; i++) {
  console.log(i);
}

// ✅ Also correct (for different use cases)
const items = [1, 2, 3];
for (const item of items) {
  // const is fine here
  console.log(item);
}
```

### 3. Temporal Dead Zone

```javascript
// ❌ Problematic
function example() {
  console.log(x); // ReferenceError
  let x = 1;
}

// ✅ Correct
function example() {
  let x = 1;
  console.log(x); // 1
}
```

## Exercise: Refactor Legacy Code

Refactor this `var`-based code to use `let` and `const`:

```javascript
var config = {
  theme: "light",
  language: "en",
};

function processData(data) {
  var results = [];
  var errors = [];

  for (var i = 0; i < data.length; i++) {
    var item = data[i];

    if (item.valid) {
      var processed = transform(item);
      results.push(processed);
    } else {
      var error = "Invalid item at index " + i;
      errors.push(error);
    }
  }

  var summary = {
    total: data.length,
    processed: results.length,
    errors: errors.length,
  };

  return summary;
}
```

Your refactored version should use `const` and `let` appropriately.

## Summary

In this lesson, you learned:

✅ **Block scope** - How `let` and `const` provide block-level scoping  
✅ **const behavior** - Preventing reassignment while allowing mutation  
✅ **Temporal Dead Zone** - Understanding variable lifecycle  
✅ **Best practices** - When to use `const` vs `let`  
✅ **Common pitfalls** - Avoiding mistakes with modern declarations

Next, we'll explore arrow functions and how they change the way we write JavaScript functions!
