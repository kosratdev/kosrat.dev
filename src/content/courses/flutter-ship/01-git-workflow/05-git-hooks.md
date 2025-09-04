---
type: "lesson"
title: "Git Hooks"
order: 5
published: 2025-09-03
draft: false
---

# Git Hooks

Learn how to automate quality checks and enforce standards using Git hooks in your Flutter project.

## What are Git Hooks?

Git hooks are scripts that Git executes before or after events such as commit, push, and receive. They're a powerful way to customize Git's behavior and enforce project standards.

## Common Git Hooks for Flutter

### pre-commit

Runs before a commit is created. Perfect for:

- Code formatting (dart format)
- Linting (dart analyze)
- Running tests
- Checking commit message format

### pre-push

Runs before pushing to a remote repository:

- Run full test suite
- Build verification
- Security scans

### commit-msg

Validates commit messages:

- Enforce conventional commit format
- Check message length
- Ensure proper formatting

## Setting Up Git Hooks

### Manual Setup

1. Navigate to `.git/hooks/` directory
2. Create executable scripts (remove `.sample` extension)
3. Make them executable: `chmod +x pre-commit`

### Using Husky (Recommended)

Install Husky for easier hook management:

```bash
npm install --save-dev husky
npx husky install
```

Add hooks to `package.json`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "dart format --set-exit-if-changed . && dart analyze",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## Flutter-Specific Hook Examples

### Pre-commit Hook for Flutter

```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Format Dart code
echo "Formatting Dart code..."
dart format --set-exit-if-changed .
if [ $? -ne 0 ]; then
  echo "❌ Code formatting failed. Please run 'dart format .'"
  exit 1
fi

# Analyze Dart code
echo "Analyzing Dart code..."
dart analyze
if [ $? -ne 0 ]; then
  echo "❌ Dart analyze found issues. Please fix them."
  exit 1
fi

# Run tests
echo "Running tests..."
flutter test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Please fix them."
  exit 1
fi

echo "✅ All pre-commit checks passed!"
```

### Pre-push Hook

```bash
#!/bin/sh
# .git/hooks/pre-push

echo "Running pre-push checks..."

# Build app to ensure it compiles
echo "Building app..."
flutter build apk --debug
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix compilation errors."
  exit 1
fi

echo "✅ Pre-push checks passed!"
```

## Best Practices

1. **Keep hooks fast**: Avoid long-running operations in pre-commit
2. **Make them optional**: Allow developers to skip hooks when needed (`--no-verify`)
3. **Share with team**: Use tools like Husky to ensure everyone has the same hooks
4. **Document hooks**: Explain what each hook does and why
5. **Test hooks**: Ensure hooks work correctly across different environments

## Advanced Git Hooks

- **Automated dependency updates**
- **Security vulnerability scanning**
- **Performance regression detection**
- **Automated documentation generation**
- **Code coverage enforcement**
