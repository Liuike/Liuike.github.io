# Repository Instructions

## Repository structure

- `docs/` is the Jekyll source and deployment root.
  - `_posts/`, `_projects/`, and `pages/` contain site content.
  - `_layouts/` and `_includes/` contain shared page structure.
  - `assets/css/`, `assets/js/`, and `assets/img/` contain source assets.
  - `_site/` is generated output; never edit it directly.
- `design.md` is the locked visual system. Reuse its tokens, typography, and motion stance.
- `README.md` documents local development commands.

## Site rules

- Make site changes in `docs/`, then rebuild; do not hand-edit generated files.
- Keep visual CSS token-based. Add new colours, spacing, or typography values to `docs/assets/css/tokens.css` before using them.
- Preserve the established calm, technical design and existing routes unless the task explicitly changes them.
- Keep JavaScript interactions accessible: keyboard operation, visible focus, and touch use must remain complete.
- Do not add production dependencies without approval.

## Verification

- For rendered changes, run `bundle exec jekyll build` from `docs/`.
- For visual or interactive changes, inspect the local site at `http://127.0.0.1:4000/` after rebuilding.
- Review the final diff and avoid unrelated cleanup.

## Safety

- Preserve user changes in a dirty worktree and inspect overlapping edits before modifying them.
- Do not discard changes or run destructive Git commands unless explicitly requested.
- Keep secrets, credentials, and machine-specific paths out of committed files and logs.
