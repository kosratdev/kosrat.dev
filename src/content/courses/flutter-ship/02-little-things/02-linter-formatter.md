---
type: "lesson"
title: "Linter & Formatter"
order: 2
published: 2025-09-03
draft: true
---

# Linter & Formatter

Set up consistent code style and catch potential issues early with proper linting and formatting in your Flutter project.

## Why Linting and Formatting Matter

- **Consistency**: Ensures uniform code style across the team
- **Quality**: Catches potential bugs and code smells
- **Readability**: Makes code easier to read and maintain
- **Efficiency**: Reduces time spent on code style discussions

## Dart Formatter

Flutter comes with a built-in formatter that enforces consistent style.

### Basic Usage

```bash
# Format all Dart files
dart format .

# Format specific file
dart format lib/main.dart

# Check formatting without changing files
dart format --set-exit-if-changed .
```

### IDE Integration

Most IDEs can format on save:

**VS Code**: Install Dart extension and enable format on save
**Android Studio**: Enable Dart format on save in preferences
**IntelliJ**: Configure Dart formatting in Code Style settings

## Dart Analyzer (Linter)

The analyzer helps catch errors and suggests improvements.

### Configuration File

Create or update `analysis_options.yaml`:

```yaml
include: package:flutter_lints/flutter.yaml

analyzer:
  exclude:
    - "**/*.g.dart"
    - "**/*.freezed.dart"
  strong-mode:
    implicit-casts: false
    implicit-dynamic: false

linter:
  rules:
    # Error rules
    - avoid_print
    - avoid_unnecessary_containers
    - prefer_const_constructors
    - prefer_const_literals_to_create_immutables

    # Style rules
    - camel_case_types
    - library_names
    - file_names
    - parameter_assignments

    # Performance rules
    - avoid_function_literals_in_foreach_calls
    - prefer_final_in_for_each
    - prefer_final_locals

    # Documentation rules
    - public_member_api_docs
    - package_api_docs
```

### Running Analysis

```bash
# Analyze all files
flutter analyze

# Analyze with fatal warnings
flutter analyze --fatal-warnings

# Analyze specific directory
flutter analyze lib/
```

## Advanced Linting

### Custom Lint Rules

For more advanced linting, consider packages like:

- **`custom_lint`**: Create custom lint rules
- **`dart_code_metrics`**: Advanced code metrics and rules
- **`solid_lints`**: Additional lint rules for better code quality

### Example with dart_code_metrics

```yaml
# analysis_options.yaml
include: package:flutter_lints/flutter.yaml

analyzer:
  plugins:
    - dart_code_metrics

dart_code_metrics:
  anti-patterns:
    - long-method
    - long-parameter-list
  metrics:
    cyclomatic-complexity: 20
    maximum-nesting-level: 5
    number-of-parameters: 4
    source-lines-of-code: 50
  rules:
    - newline-before-return
    - no-boolean-literal-compare
    - no-empty-block
    - prefer-trailing-comma
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: "3.13.x"

      - name: Get dependencies
        run: flutter pub get

      - name: Check formatting
        run: dart format --set-exit-if-changed .

      - name: Analyze code
        run: flutter analyze --fatal-warnings
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Checking code formatting..."
dart format --set-exit-if-changed .
if [ $? -ne 0 ]; then
  echo "❌ Code is not properly formatted. Run 'dart format .'"
  exit 1
fi

echo "Running dart analyze..."
flutter analyze
if [ $? -ne 0 ]; then
  echo "❌ Dart analyzer found issues. Please fix them."
  exit 1
fi

echo "✅ Code quality checks passed!"
```

## Team Guidelines

### Code Style Standards

1. **Consistent naming**: Use camelCase for variables, PascalCase for classes
2. **Const constructors**: Use `const` where possible for performance
3. **File organization**: Group imports and organize code logically
4. **Documentation**: Document public APIs and complex logic
5. **Line length**: Keep lines under 80 characters when possible

### Formatter Settings

Create `.vscode/settings.json` for team consistency:

```json
{
  "dart.lineLength": 80,
  "editor.formatOnSave": true,
  "editor.formatOnType": true,
  "dart.analysisServerFolding": true,
  "dart.previewCommitCharacters": true
}
```

## Common Issues and Solutions

### Formatting Conflicts

**Problem**: Different team members have different formatting
**Solution**: Use shared `analysis_options.yaml` and enforce in CI

### Performance Impact

**Problem**: Large projects take time to analyze
**Solution**: Use exclude patterns and incremental analysis

### Legacy Code

**Problem**: Existing code doesn't meet new standards
**Solution**: Gradually improve code and use `// ignore:` comments temporarily

## Best Practices

1. **Start early**: Set up linting and formatting from project start
2. **Team agreement**: Get team consensus on style guidelines
3. **Gradual adoption**: Introduce rules progressively for existing projects
4. **Automation**: Use IDE features and CI/CD to enforce standards
5. **Regular updates**: Keep linter packages updated for new rules

## Useful Commands

```bash
# Fix all auto-fixable issues
dart fix --apply

# Get suggestions for improvements
dart fix --dry-run

# Format and analyze in one go
dart format . && flutter analyze

# Check for outdated dependencies
flutter pub outdated
```
