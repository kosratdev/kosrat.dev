---
type: "lesson"
title: "Source Code"
order: 7
published: 2025-09-03
draft: false
---

# Source Code

Access the complete source code and examples for the Git & GitHub Workflow section.

## Repository Structure

This section's examples and configurations can be found in the course repository:

```
flutter-ship-examples/
├── git-workflow/
│   ├── .github/
│   │   └── workflows/
│   │       ├── ci.yml
│   │       ├── build.yml
│   │       └── release.yml
│   ├── .git/
│   │   └── hooks/
│   │       ├── pre-commit
│   │       ├── pre-push
│   │       └── commit-msg
│   ├── .husky/
│   │   ├── pre-commit
│   │   └── commit-msg
│   ├── CHANGELOG.md
│   ├── commitlint.config.js
│   └── package.json
```

## Quick Setup

Clone the examples repository:

```bash
git clone https://github.com/flutter-ship/examples.git
cd examples/git-workflow
```

### Install Dependencies

```bash
# Install Node.js dependencies for tooling
npm install

# Install Flutter dependencies
flutter pub get
```

### Setup Git Hooks

```bash
# Using Husky (recommended)
npx husky install

# Or copy hooks manually
cp .git/hooks-examples/* .git/hooks/
chmod +x .git/hooks/*
```

## Files Overview

### GitHub Actions Workflows

- **`ci.yml`**: Continuous integration workflow
- **`build.yml`**: Build verification for multiple platforms
- **`release.yml`**: Automated releases and changelog generation

### Git Hooks

- **`pre-commit`**: Code formatting, linting, and basic tests
- **`pre-push`**: Comprehensive testing and build verification
- **`commit-msg`**: Commit message validation

### Configuration Files

- **`commitlint.config.js`**: Commit message linting configuration
- **`CHANGELOG.md`**: Example changelog following Keep a Changelog format
- **`package.json`**: Node.js dependencies for tooling

## Customization Guide

### Adapting for Your Project

1. **Update workflow triggers** based on your branching strategy
2. **Modify Flutter version** in workflows to match your project
3. **Adjust code coverage thresholds** based on your requirements
4. **Add project-specific lint rules** to analysis_options.yaml
5. **Configure additional security scans** if needed

### Environment Variables

Set these secrets in your GitHub repository:

```bash
# For automated releases
GITHUB_TOKEN=your_github_token

# For external integrations
CODECOV_TOKEN=your_codecov_token
SLACK_WEBHOOK=your_slack_webhook
```

## Testing the Setup

### Test Commit Message Validation

```bash
# This should fail
git commit -m "bad commit message"

# This should pass
git commit -m "feat: add user authentication"
```

### Test Pre-commit Hooks

```bash
# Create a poorly formatted file
echo "class BadFormat{}" > lib/bad_format.dart
git add lib/bad_format.dart
git commit -m "feat: add bad format file"
# Hook should auto-format or fail
```

### Test GitHub Actions

1. Create a pull request
2. Watch for status checks to appear
3. Verify all checks pass
4. Review the Actions tab for detailed logs

## Troubleshooting

### Common Issues

1. **Hooks not executing**: Check file permissions with `ls -la .git/hooks/`
2. **Flutter version mismatch**: Update workflow Flutter version
3. **Dependencies not found**: Ensure `flutter pub get` runs successfully
4. **Tests failing**: Check test environment and dependencies

### Getting Help

- Check the [course discussions](https://github.com/flutter-ship/discussions)
- Review [example repository issues](https://github.com/flutter-ship/examples/issues)
- Join our [Discord community](https://discord.gg/flutter-ship)

## Next Steps

Now that you have a solid Git workflow foundation:

1. **Practice** the workflow with a sample project
2. **Customize** the configurations for your team's needs
3. **Train your team** on the new processes
4. **Monitor** and improve the workflow based on feedback

Ready to move on to the next section: **Little Things That Matter Most**!
