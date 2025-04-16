---
title: Git & GitHub Cheat Sheet
published: 2024-05-28
description: ''
image: ''
tags: [git, github]
category: 'Software Development'
draft: false 
---
Having a `Git` and `GitHub` cheat sheet is highly beneficial, especially for those who frequently utilize these tools but may not remember every command. Git commands are crucial as they allow us to perform tasks like creating new repositories, making changes to existing projects, and viewing the history of our changes.

![image](git.gif)

This **cheat sheet** is a handy reference guide for both beginners and experienced users. For beginners, it provides a simple and quick way to learn and use the most common commands. For experienced users, it serves as a quick reference for less frequently used commands or options. By having all the essential Git and GitHub commands in one place, productivity can be improved and common tasks can be performed faster 👌.

### **Git Configurations**
```bash
# Sets up Git with your name
git config --global user.name "<Your-Full-Name>"

# Sets up Git with your email
git config --global user.email "<your-email-address>"

# Sign all commits by default 
git config --global commit.gpgsign true

# Globally disables fast-forward merging by default
git config --global merge.ff false

# Makes sure that Git output is colored
git config --global color.ui auto

# Displays the original state in a conflict
git config --global merge.conflictstyle diff3

# Configure text editor
git config --global core.editor "[code, atom, vim , nano, gedit] --wait"

# List all your configurations
git config --list
```

### Git Startup Commands
```bash
# Create brand new repositories (repos) on your computer.
git init

# Copy existing repos from somewhere else to your local computer.
git clone {Repo URL}

# Check the status of a repo
git status
```

### Git Log
```bash
# Display information about the existing commits.
git log

# Display commits per one line.
git log --oneline

# Display the files that have been changed in the commit.
git log --stat

# display the actual changes made to a file.
git log -p

# display the actual changes made to a commit.
git log -p {commit id}
# Or 
git show {commit id}
```

### Git Add & Commit
```bash
# Add files from the working directory to the staging index.
git add

# add files
git add {file1} {file2} ...

# Add all files in the current directory
git add .

# Take files from the staging index and save them in the repository.
git commit

# Displays the difference between two versions of a file.
git diffas
```

### Refresh gitignore
```bash
# Unstage all files 
git rm -r --cached .

# Add them back in so that, the new .gitignore files will work.
git add .
```

### Git Tag
```bash
# Add a signed tag
git tag -s v1.0

# Display all tags
git tag

# Delete a tag locally
git tag -d v1.0

# Delete a tag from the remote
git push --delete origin v1.0

# Adding a tag to a past commit
git tag -a v1.0 {commit id}
```

### Git Branch
```bash
# List all branch names in the repository.
git branch

# Create new branch named sidebar.
git branch sidebar

# Change current branch to sidebar.
git checkout sidebar

# Create the alt-sidebar-loc branch and have it point to the commit with SHA 42a69f.
git branch alt-sidebar-loc 42a69f

# Delete a branch.
git branch -d sidebar

# Force delete a branch.
git branch -D sidebar

# see all branches' history at once.
git log --oneline --decorate --graph --all

# Create a branch and then checkout to the new branch.
git checkout -b fix-footer
```

### Git Merge
```bash
# Merge sidebar into current branch without fast forwarding merge.
git merge --no-ff sidebar
```

### Git Revert & Reset
```bash
# Alter the most-recent commit or add missing files
git commit --amend

# Reverses given commit
git revert {commit-id}

# Erases commits
git reset
git reset [tags] HEAD~1
tags:
--mix -> move commit to working directory
--soft -> move commit to staged index
--hard -> move commit to trash
```

### GitHub
```bash
# Display full path to the remote repository.
git remote -v

# Create a connection from local repository to the remote repository.
git remote add origin {repository link}

# Send changes to the remote
git push

# Retrieve updates from the remote
git pull
```

That's all for this Git and GitHub cheat sheet! Keep this guide handy for quick reference while working on your projects. Remember, practice makes perfect, so keep using these commands until they become second nature. `Happy coding! 👨‍💻👩‍💻`