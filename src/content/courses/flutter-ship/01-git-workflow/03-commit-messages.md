---
type: "lesson"
title: "Commit Messages"
order: 3
published: 2025-09-03
draft: false
---

# Commit Messages

Learn how to write clear, consistent, and meaningful commit messages that help your team understand changes at a glance.

## Why Good Commit Messages Matter

- They help team members understand what changed and why
- They make code reviews more efficient
- They assist in debugging when looking through git history
- They support automated changelog generation

## Conventional Commits Format

We recommend following the Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

## Examples

```bash
feat(auth): add login with Google functionality

fix: resolve crash when user has no internet connection

docs: update README with new installation instructions

refactor(api): simplify user service methods
```

## Best Practices

1. **Keep the subject line under 50 characters**
2. **Use the imperative mood** ("Add feature" not "Added feature")
3. **Don't end with a period**
4. **Use the body to explain what and why, not how**
5. **Reference issues when applicable**

## Tools and Automation

- Use commitlint to enforce commit message standards
- Set up git hooks to validate commit messages
- Configure your IDE for commit message templates
