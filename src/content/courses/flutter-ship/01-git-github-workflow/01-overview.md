---
type: "lesson"
title: "Overview"
order: 1
published: 2025-09-03
draft: true
---

More than two decades ago, **Git** emerged as a version control system (**VCS**) to facilitate teamwork and track changes in a version history. Nowadays, Git is an essential tool for software developers, especially for those working in a team. Complementing Git, platforms like **GitHub** provide hosting for Git repositories, enabling collaboration and sharing.

In this post, I will show you how to setup a **production-ready Git & GitHub workflow** for your project. As you may know, this article is a part of the [**Flutter Ship**](../) series, which guides you in shipping a production-ready Flutter app. However, these principles can be applied to **any language or framework**.

By the end of this article, you will learn the following:

1.  How to implement a simple but effective **branching strategy**.
2.  How to adopt a **commit message standard** for a clean history and automated changelogs.
3.  How to automatically generate and manage **project changelogs**.
4.  How to use **Git hooks** to automate local checks, like formatting & linting files, linting commits, and running tests.
5.  How to implement a **GitHub PR Checks** with **GitHub Actions** to automate your workflow.

If this sounds like what you're looking for, let's dive in!
