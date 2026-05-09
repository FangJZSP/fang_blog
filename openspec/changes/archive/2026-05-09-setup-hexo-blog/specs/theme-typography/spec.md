## ADDED Requirements

### Requirement: Theme installed and activated

The hexo-theme-typography theme SHALL be cloned into `themes/typography/` and set as the active theme in Hexo's root `_config.yml` (`theme: typography`).

#### Scenario: Theme directory exists

- **WHEN** the theme is installed
- **THEN** the directory `themes/typography/` exists and contains the theme's `_config.yml` and layout templates

#### Scenario: Theme is active

- **WHEN** the blog renders any page
- **THEN** the page uses the typography theme's layout (Pug templates) instead of the default theme

### Requirement: Syntax highlighting configured

The project SHALL disable Hexo's built-in syntax highlighting and enable `hexo-prism-plugin` with `mode: 'preprocess'`, `theme: 'default'`, and `line_number: true`.

#### Scenario: Prism highlighting on code blocks

- **WHEN** a post contains a fenced code block
- **THEN** the rendered page shows syntax-highlighted code with line numbers

#### Scenario: Built-in highlighter disabled

- **WHEN** `_config.yml` is checked
- **THEN** `highlight.enable` is set to `false`

### Requirement: Theme appearance configured

The theme's `_config.yml` SHALL be configured with `themeStyle: light`, a `title_primary`, a `title_secondary`, and `truncate_len` for post excerpts.

#### Scenario: Theme colors render correctly

- **WHEN** the blog is viewed
- **THEN** the light color scheme is applied

#### Scenario: Multi-level titles display

- **WHEN** the blog home page loads
- **THEN** both `title_primary` (main title) and `title_secondary` (subtitle) are visible in the header

### Requirement: Generator plugins configured

The root `_config.yml` SHALL configure `archive_generator` (`per_page: 0`), `category_generator` (`per_page: 10`, `enable_index_page: true`), `tag_generator` (`per_page: 10`, `enable_index_page: true`), and `feed` (`type: atom`, `path: atom.xml`, `limit: 20`).

#### Scenario: Archive page works

- **WHEN** `/archives` is accessed
- **THEN** a list of all posts is displayed

#### Scenario: Category index page works

- **WHEN** `/categories` is accessed
- **THEN** a list of all categories is displayed with post counts

#### Scenario: Tag index page works

- **WHEN** `/tags` is accessed
- **THEN** a list of all tags is displayed with post counts

#### Scenario: Atom feed accessible

- **WHEN** `/atom.xml` is accessed
- **THEN** a valid Atom XML feed is returned containing recent posts

### Requirement: Social links display

The theme config SHALL include a `github` social link pointing to the user's GitHub profile. Other unused social fields (`twitter`, `weibo`, `instagram`) SHALL be left empty.

#### Scenario: GitHub icon appears in footer

- **WHEN** the blog renders
- **THEN** a GitHub icon linking to the configured profile is displayed

#### Scenario: Unused social icons hidden

- **WHEN** the blog renders
- **THEN** no Twitter, Weibo, or Instagram icons appear
