# Badcamp Styleguide (via Pattern Lab)

## Requirements

1.  [PHP 7.1](http://www.php.net/)
2.  [Node + NPM](https://nodejs.org/en/)
3.  [Composer](https://getcomposer.org/)

## Installation and Local Development Setup

1. Clone this repo
2. Navigate to repo directory
3. Run `composer install`
4. Run `npm install`
5. Run `npm run gulp`

## Gulp default task

The gulp default task includes initial PL site generation, regeneration as necessary, css and js compilation, and the watch task. Type `^c` to stop the task.

## Contributing to this project

Never commit directly to the `develop` or `master` branches. All contributions should be added via pull requests.

## Working on patterns

Navigate to `components/_patterns`. This is where all work should take place. Each pattern is self-contained in a directory.

### How to add a new pattern

1. Navigate to `components/_patterns/[category]`
2. Create a directory with the name of your pattern (no spaces)
3. All code for a pattern should be stored within the pattern's directory. Use your folder name as the base file name like the examples below:

- `pattern-name.twig`
- `pattern-name.yml` (optional, but used for dummy content)
- `_pattern-name.scss` (pattern-specific styles)
- `pattern-name.js` (optional, if component-specific js is needed)
- `pattern-name.md` (optional, but helpful to display additional information about your component in the styleguide)

Each directory is ordered alphabetically. To re-order the patterns, just add numbers to the beginning. You may optionally organize patterns into subtypes with subdirectories.

**NOTE:** Adding a new folder may require you to restart your task runner (gulp).

### Nested Patterns

It is best practice to build up patterns from smaller patterns when appropriate.

### How to create sample content

Sample content is created via the patterns' `.yml` file. Any variables included in the corresponding `.twig` file should be assigned in the `.yml` file.

**NOTE:** Sample content does not nest along with the pattern's `.twig` file. For example, this content must also be included in the `site-footer.yml` file since "address-block" is nested within "site-footer".

In addition to pattern-specific data, sample data can be assigned at the root-level of the styleguide in the `/components/_data/data.yml` file. Pattern-level data will override data from this file.

### How to create pseudo-patterns

Pseudo-patterns are used to create variants of existing patterns. This is useful for showing multiple color variations, content variants, site-specific variations, alternate states, etc...

The tilde (`~`) is used to designate a pseudo-pattern. All pseudo-patterns should be stored within the original pattern's directory.

### Pattern organization

Patterns are divided into categories that progressively become more complex. This is based off of [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/).

### Use BEM methodology when possible

- A great intro to BEM: [BEM will make you happy](https://medium.com/@basterrika/bem-will-make-you-happy-ab0d0a821226)
- Here's the full details: [Methodology / BEM](https://en.bem.info/methodology/)
- We don't have to be super strict about it right now, but let's do what we can.
- Provide options to accept modifiers as variables on lower-level (Atoms, Molecules) patterns.
