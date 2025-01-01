# How to Write a Changelog for This Project

## Introduction

This project uses **Conventional Commits** for generating the changelog automatically. Please follow the guidelines below when making commits to ensure that the changelog is updated properly.

## Commit Types

The following types should be used for commit messages:

- **feat:** A new feature for the user.
- - Example: `feat: add command to fetch user info`

- **fix:** A bug fix.
- - Example: `fix: resolve error in userinfo command.`

- **chore:** Changes that don't affect the source code or bot logic (e.g., updating dependencies, formatting).
- - Example: `chore: update dependencies`

- **refactor:** Code changes that neither fix bugs nor add features, but improve code structure or readability.
- - Example: `refactor: simplify message parsing logic`

- **perf:** A code change that improves performance.
- - Example: `perf: optimize command handler to reduce latency`

- **test:** Adding or modifying tests.
- - Example: `test: add unit test for userinfo command`

- **build:** Changes to the build process or tools.
- - Example: `build: update bot build script`

- **ci:** Changes to Continuous Integration configurations (e.g., GitHub Actions).
- - Example: `ci: update GitHub Actions workflow for deployment`

## Format for Commit Messages

Each commit message should follow this format:

```arduino
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

Example:

```sql
feat(bot): add user profile command

- Implemented new profile command to fetch and display user profile
```

example of git usage:

```sql
git add src/index.ts
git commit -m "chore: import new package."
git add .
git commit -m "feat: Added new command work."author
npm run release
git push
```

## Commit Message Examples

- `feat: add command to fetch user info`
- `fix: resolve error in userinfo command`
- `chore: update discord.js to v14`
- `refactor: simplify argument parsing in help command`
- `perf: optimize ping response time`
- `test: add unit tests for developer command`
- `build: update bot build process with pm2 support`
- `ci: update GitHub Actions for automated deployment`

## Running the Changelog Update

After your commit is made following the above guidelines, the changelog can be updated automatically with the following command:

```bash
npm run release
```

if you want to add a minor update, use:

```bash
npm run release -- --release-as minor
or
npm run release -- --release-as 1.1.0
```

> this will put the version to v1.1.0

if you want to add a prerelease update, use:

```bash
npm run release -- --release-as --prerelease
```

> this will put the version to v1.0.1-0

for small updates, use:

```bash
npm run release
```

> this will put the version to v13..1

This will trigger the changelog generation and version bump (if necessary).

## Notes

- Always write clear and concise commit messages.
- For bug fixes, use fix.
- For new bot commands or features, use feat.
- Documentation changes should be in docs.

By following these guidelines, we can ensure that the changelog is accurate, easy to read, and useful to anyone tracking the project's progress.
