# CI/CD Workflows

SocialPostAI uses GitHub Actions for continuous integration, automated releases, and extension packaging.

## Workflows Overview

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Actions:**
- ✅ Lint codebase
- ✅ Build all packages
- ✅ Run tests (if available)
- ✅ Package extension and upload as artifact

**Matrix Strategy:**
- Tests on Node.js 18.x and 20.x

### 2. Release Workflow (`.github/workflows/release.yml`)

**Triggers:**
- Push of version tags (e.g., `v1.2.3`)

**Actions:**
- ✅ Extract version from tag
- ✅ Generate release notes from git commits
- ✅ Build and package VSIX extension
- ✅ Create GitHub Release with notes
- ✅ Attach VSIX file to release

**Usage:**
```bash
# Create a version tag
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
```

### 3. Version Bump Workflow (`.github/workflows/version-bump.yml`)

**Triggers:**
- Manual workflow dispatch from GitHub Actions UI

**Actions:**
- ✅ Bump version in `package.json` and `packages/extension/package.json`
- ✅ Update `CHANGELOG.md` with new version entry
- ✅ Commit and push changes
- ✅ Create version tag
- ✅ Trigger release workflow

**Usage:**
1. Go to **Actions** → **Version Bump**
2. Click **Run workflow**
3. Select version bump type:
   - `patch`: 0.1.0 → 0.1.1 (bug fixes)
   - `minor`: 0.1.0 → 0.2.0 (new features)
   - `major`: 0.1.0 → 1.0.0 (breaking changes)
4. Click **Run workflow**

### 4. Package Workflow (`.github/workflows/package.yml`)

**Triggers:**
- Manual workflow dispatch
- Push to `main` with changes to extension packages

**Actions:**
- ✅ Build all packages
- ✅ Create VSIX package
- ✅ Upload VSIX as artifact
- ✅ Optionally publish to VS Code Marketplace (requires `VSCE_PAT` secret)

## Setting Up Secrets

For VS Code Marketplace publishing, add a Personal Access Token:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `VSCE_PAT`
4. Value: Your VS Code Marketplace Personal Access Token
   - Create at: https://marketplace.visualstudio.com/manage/publishers/VoxHashTechnologies

## Release Process

### Automated Release (Recommended)

1. **Bump version:**
   - Go to Actions → Version Bump → Run workflow
   - Select bump type (patch/minor/major)
   - Workflow will create tag and trigger release

2. **Manual tag (Alternative):**
   ```bash
   git tag -a v0.2.0 -m "Release v0.2.0"
   git push origin v0.2.0
   ```

3. **Release workflow runs automatically:**
   - Creates GitHub Release
   - Generates release notes
   - Packages VSIX extension
   - Attaches VSIX to release

### Manual Release

1. Update version in `package.json` files
2. Update `CHANGELOG.md`
3. Commit changes
4. Create and push tag:
   ```bash
   git tag -a v0.2.0 -m "Release v0.2.0"
   git push origin v0.2.0
   ```

## Artifacts

All workflows produce downloadable artifacts:

- **CI**: Extension build artifacts (7 days retention)
- **Release**: VSIX package (30 days retention)
- **Package**: VSIX package (30 days retention)

Download from the workflow run page → **Artifacts** section.

## Status Badges

Add to your README:

```markdown
![CI](https://github.com/VoxHash-Technologies/SocialPostAI/workflows/CI/badge.svg)
![Release](https://github.com/VoxHash-Technologies/SocialPostAI/workflows/Release/badge.svg)
```

## Troubleshooting

**Workflow fails on build:**
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Review build logs for TypeScript errors

**Release not created:**
- Ensure tag format is `v*.*.*` (e.g., `v1.2.3`)
- Check workflow has `contents: write` permission
- Verify tag was pushed to remote

**VSIX not attached:**
- Check `vsce` installation succeeded
- Verify extension package.json has required fields
- Review package workflow logs
