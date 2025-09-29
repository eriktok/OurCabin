# Git Repository Setup Guide

This guide will help you set up your OurCabin React Native project in a private Git repository.

## 🚀 Initial Repository Setup

### 1. Create a Private Repository

Choose your Git hosting platform:

#### GitHub
1. Go to [GitHub](https://github.com) and sign in
2. Click "New repository"
3. Name it `OurCabin` (or your preferred name)
4. Set visibility to **Private**
5. Don't initialize with README (we already have one)
6. Click "Create repository"

#### GitLab
1. Go to [GitLab](https://gitlab.com) and sign in
2. Click "New project" → "Create blank project"
3. Set visibility to **Private**
4. Don't initialize with README
5. Click "Create project"

#### Bitbucket
1. Go to [Bitbucket](https://bitbucket.org) and sign in
2. Click "Create repository"
3. Set visibility to **Private**
4. Don't initialize with README
5. Click "Create repository"

### 2. Initialize Local Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: React Native OurCabin project"

# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/yourusername/OurCabin.git

# Push to main branch
git branch -M main
git push -u origin main
```

## 🔐 Security Best Practices

### Files to NEVER Commit

The following files should **NEVER** be committed to your repository:

- `.env` files (any environment files)
- API keys and secrets
- Private certificates (`.pem`, `.p12`, `.mobileprovision`)
- Database credentials
- Third-party service keys
- Local configuration files

### Pre-commit Security Check

Before every commit, verify these files are not being added:

```bash
# Check what files are staged
git status

# Check for sensitive files
git diff --cached --name-only | grep -E '\.(env|key|pem|p12|mobileprovision)$'
```

### Environment Variables

1. **Always use `.env.example`** as a template
2. **Never commit actual `.env` files**
3. **Document all required environment variables** in `.env.example`
4. **Use different environment files** for different stages:
   - `.env.development`
   - `.env.staging`
   - `.env.production`

## 📁 Repository Structure

Your repository should have this structure:

```
OurCabin/
├── .gitignore              # Comprehensive ignore rules
├── .env.example           # Environment template
├── setup.sh              # Setup script for new developers
├── README.md             # Project documentation
├── GIT_SETUP.md          # This file
├── package.json          # Dependencies
├── src/                  # Source code
│   ├── components/       # Reusable components
│   ├── screens/          # Screen components
│   ├── services/        # API services
│   └── core/            # Core utilities
├── android/             # Android-specific code
├── ios/                 # iOS-specific code
└── __tests__/           # Test files
```

## 🚀 Development Workflow

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push feature branch
git push origin feature/your-feature-name

# Create pull request on your Git platform
```

### Commit Message Convention

Use clear, descriptive commit messages:

```bash
# Good examples
git commit -m "feat: add user authentication"
git commit -m "fix: resolve navigation issue"
git commit -m "docs: update README with setup instructions"

# Bad examples
git commit -m "fix"
git commit -m "WIP"
git commit -m "updates"
```

## 🔧 Team Collaboration

### For New Team Members

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/OurCabin.git
   cd OurCabin
   ```

2. **Run setup script**
   ```bash
   ./setup.sh
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

### Branch Protection Rules

Set up branch protection rules on your Git platform:

1. **Require pull request reviews** before merging
2. **Require status checks** to pass
3. **Require branches to be up to date** before merging
4. **Restrict pushes** to main branch

## 🚨 Security Checklist

Before pushing to your repository, verify:

- [ ] No `.env` files are staged
- [ ] No API keys or secrets in code
- [ ] No private certificates committed
- [ ] All sensitive data is in environment variables
- [ ] `.gitignore` is comprehensive and up to date
- [ ] `.env.example` documents all required variables

## 📝 Documentation

Keep these files updated:

- `README.md` - Project overview and setup
- `GIT_SETUP.md` - This file
- `.env.example` - Environment variables template
- `setup.sh` - Automated setup script

## 🆘 Troubleshooting

### Common Issues

1. **Accidentally committed sensitive files**
   ```bash
   # Remove from git history
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env' \
   --prune-empty --tag-name-filter cat -- --all
   ```

2. **Large files in repository**
   ```bash
   # Use Git LFS for large files
   git lfs track "*.png"
   git lfs track "*.jpg"
   git lfs track "*.pdf"
   ```

3. **Node modules accidentally committed**
   ```bash
   # Remove from git
   git rm -r --cached node_modules
   git commit -m "Remove node_modules from git"
   ```

## 📞 Support

If you encounter issues:

1. Check the [React Native documentation](https://reactnative.dev/docs/getting-started)
2. Review the project's README.md
3. Check your environment setup
4. Verify all dependencies are installed correctly
