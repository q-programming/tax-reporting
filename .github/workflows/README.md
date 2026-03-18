# GitHub Actions Workflows

## Custom Droid Workflow

The `custom-droid.yml` workflow enables automated code changes via `@droid` mentions in pull requests.

### Setup

#### Required Secret: `FACTORY_API_KEY`
Add your Factory API key to GitHub Secrets:
1. Go to repository Settings → Secrets and variables → Actions
2. Create a new secret named `FACTORY_API_KEY`
3. Paste your Factory API key from https://app.factory.ai/settings

**Note:** PRs created by this workflow use `GITHUB_TOKEN`, which means CI workflows won't automatically trigger on the created PR (GitHub security feature to prevent recursive workflows). You can manually trigger workflows on the created PR, or they'll run when you merge it.

### Features

1. **Follow-up requests**: If you `@droid` again in the same PR, it will update the existing droid branch instead of creating a new one
2. **Auto-generated PR descriptions**: Uses Droid to analyze changes and write meaningful PR descriptions
3. **Skills support**: Automatically detects and uses skills from `.factory/skills/`

### Usage

Comment on any PR with:
```
@droid fix all ESLint errors
```

Droid will:
1. Create a new branch `droid/pr-{number}/fix-all-eslint-errors-{timestamp}`
2. Make the requested changes
3. Run checks (lint, typecheck, tests)
4. Create a PR with the changes back to your PR branch
5. Add reactions and comments to track progress

### Workflow Triggers

- `issue_comment` - Comments on PR
- `pull_request_review_comment` - Inline PR review comments  
- `pull_request_review` - PR review submissions
- `pull_request` - PR opened/edited with `@droid` in body/title
