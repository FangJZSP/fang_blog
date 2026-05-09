## ADDED Requirements

### Requirement: Deployer configured for GitHub Pages

The root `_config.yml` SHALL include a `deploy` section configured to use `hexo-deployer-git` with type `git`, targeting the `gh-pages` branch of the repository.

#### Scenario: Deploy config present

- **WHEN** `_config.yml` is checked
- **THEN** the `deploy` section has `type: git`, `branch: gh-pages`, and a valid `repo` URL

#### Scenario: Static files generated

- **WHEN** `hexo generate` is executed
- **THEN** a `public/` directory is created containing the full static blog site

#### Scenario: Deploy pushes to gh-pages

- **WHEN** `hexo deploy` is executed
- **THEN** the generated site is pushed to the `gh-pages` branch of the configured repository

### Requirement: gh-pages branch as GitHub Pages source

The GitHub repository SHALL be configured to serve GitHub Pages from the `gh-pages` branch at the root directory.

#### Scenario: Site accessible via GitHub Pages URL

- **WHEN** GitHub Pages is configured and deployed
- **THEN** the blog is accessible at `https://<username>.github.io/<repo>/`

### Requirement: .gitignore excludes build artifacts

The repository's `.gitignore` SHALL exclude the `public/` directory (build output), `node_modules/`, and `themes/typography/.git/` (to prevent submodule conflicts).

#### Scenario: Build artifacts not committed

- **WHEN** `git status` is checked after `hexo generate`
- **THEN** the `public/` directory does not appear as an untracked file
