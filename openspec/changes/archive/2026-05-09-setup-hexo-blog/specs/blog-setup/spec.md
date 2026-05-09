## ADDED Requirements

### Requirement: Hexo project initialization

The project SHALL be initialized as a Hexo blog in the repository root directory, producing a standard Hexo project structure including `_config.yml`, `source/`, `scaffolds/`, and `themes/` directories.

#### Scenario: Hexo init succeeds

- **WHEN** `hexo init` is executed in the repo root
- **THEN** the standard Hexo project scaffold is created with a working `_config.yml`

#### Scenario: Dev server runs

- **WHEN** `hexo server` is executed
- **THEN** the blog is accessible at `http://localhost:4000`

### Requirement: Site metadata configuration

The root `_config.yml` SHALL contain site metadata including `title`, `subtitle`, `description`, `author`, `language` (set to `zh-CN`), `timezone`, and `url`.

#### Scenario: Site title is configured

- **WHEN** the blog home page is loaded
- **THEN** the configured site `title` appears in the browser title bar and page header

#### Scenario: Language is set to Chinese

- **WHEN** the blog renders any page
- **THEN** the HTML `lang` attribute is set to `zh-CN`

### Requirement: Plugin dependencies installed

The project SHALL include all required Hexo plugins as npm dependencies: `hexo-renderer-pug`, `hexo-generator-archive`, `hexo-generator-category-enhance`, `hexo-generator-feed`, `hexo-generator-tag`, `hexo-prism-plugin`, and `hexo-deployer-git`.

#### Scenario: npm install completes without errors

- **WHEN** `npm install` is executed
- **THEN** all dependencies install successfully with no errors

#### Scenario: Unnecessary default plugin removed

- **WHEN** the project is configured
- **THEN** `hexo-generator-category` is not in `package.json` dependencies
