# Enzo's Personal Website

Personal website built with Jekyll and the [Persephone theme](https://github.com/erlzhang/jekyll-theme-persephone), hosted on GitHub Pages.

## Live Site

**[https://enzo-inc.github.io](https://enzo-inc.github.io)**

## Local Development

```bash
# Install Ruby (if not installed)
brew install ruby

# Install bundler
gem install bundler

# Install dependencies
bundle install

# Run local server
bundle exec jekyll serve
```

Visit http://localhost:4000 to preview.

## Adding Blog Posts

Create new posts in the `_posts/` directory with the naming format:

```
YYYY-MM-DD-title-of-post.md
```

Example front matter:

```yaml
---
layout: post
title: "My Post Title"
date: 2024-01-01
---
```

## Structure

```
/
├── _config.yml          # Site configuration
├── _data/
│   ├── projects.yml     # Projects data
│   └── research.yml     # Research papers
├── _posts/              # Blog posts
├── assets/img/          # Images
├── index.md             # Homepage
├── blog.md              # Blog listing
└── Gemfile              # Ruby dependencies
```
