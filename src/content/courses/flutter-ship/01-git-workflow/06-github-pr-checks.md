---
type: "lesson"
title: "GitHub PR Checks"
order: 6
published: 2025-09-03
draft: false
---

# GitHub PR Checks

Learn how to set up automated checks for Pull Requests to maintain code quality and catch issues early.

## What are PR Checks?

GitHub PR (Pull Request) checks are automated tests and validations that run when code is pushed to a pull request. They help ensure code quality before merging.

## Essential PR Checks for Flutter

### 1. Continuous Integration (CI)

Basic CI workflow that runs on every PR:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: "3.13.x"

      - name: Get dependencies
        run: flutter pub get

      - name: Analyze code
        run: flutter analyze

      - name: Format check
        run: dart format --set-exit-if-changed .

      - name: Run tests
        run: flutter test --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### 2. Build Verification

Ensure the app builds successfully:

```yaml
build:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      platform: [android, ios]
  steps:
    - uses: actions/checkout@v3

    - name: Setup Flutter
      uses: subosito/flutter-action@v2

    - name: Build ${{ matrix.platform }}
      run: |
        if [ "${{ matrix.platform }}" == "android" ]; then
          flutter build apk --debug
        else
          flutter build ios --no-codesign
        fi
```

### 3. Code Quality Checks

#### Dart Analyzer

```yaml
analyze:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: subosito/flutter-action@v2
    - run: flutter analyze --fatal-infos
```

#### Code Coverage

```yaml
coverage:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: subosito/flutter-action@v2
    - run: flutter test --coverage
    - name: Check coverage threshold
      run: |
        # Fail if coverage is below 80%
        lcov --summary coverage/lcov.info | grep -E "lines.*: ([0-9]+\.[0-9]+%)" | cut -d: -f2 | tr -d ' ' | cut -d% -f1 | awk '{if($1<80) exit 1}'
```

## Required Status Checks

Configure branch protection rules to require specific checks:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable "Require status checks to pass"
4. Select required checks:
   - `test`
   - `build`
   - `analyze`
   - `coverage`

## Advanced PR Checks

### Security Scanning

```yaml
security:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Run security audit
      run: |
        flutter pub deps
        # Add security scanning tools
```

### Performance Testing

```yaml
performance:
  runs-on: macos-latest
  steps:
    - uses: actions/checkout@v3
    - uses: subosito/flutter-action@v2
    - name: Performance test
      run: |
        flutter drive --target=test_driver/perf_test.dart
```

### Dependency Checks

```yaml
dependencies:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Check for outdated dependencies
      run: |
        flutter pub outdated --mode=null-safety
```

## PR Check Best Practices

1. **Fast Feedback**: Keep checks under 10 minutes when possible
2. **Parallel Execution**: Run independent checks in parallel
3. **Clear Naming**: Use descriptive names for checks
4. **Proper Caching**: Cache dependencies to speed up builds
5. **Fail Fast**: Stop on first critical failure
6. **Informative Messages**: Provide clear error messages

## Handling Check Failures

- **Review logs carefully**
- **Fix issues locally first**
- **Use draft PRs for work-in-progress**
- **Re-run checks after fixes**
- **Don't bypass required checks**

## Integration with Code Review

- Checks complement human code review
- Green checks don't guarantee perfect code
- Use checks to catch common issues
- Focus human review on architecture and logic
