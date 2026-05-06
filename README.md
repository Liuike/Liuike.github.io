# My Personal Website

Personal website powered by Cloudflare Pages + Jekyll.

## Local dev
```bash
cd docs
bundle install
bundle exec jekyll serve
```

Then visit [http://localhost:4000](http://localhost:4000)

## New features I want to add
- Online blog writing
- Chinese/English switch? (sounds pretty cool)
- ... something else will come to mind probably

## College narratives page
This branch serves the college narratives page at the site root. The root page lives at `docs/index.markdown`, pulls reusable markup from `docs/_includes/college_narratives_content.html`, and pulls all content from `docs/_data/college_narratives.yml`.

To update it:
- edit the page intro or main-site label in `docs/_data/college_narratives.yml`
- add a new question by appending a new item under `questions`
- add a new response by appending a new item under that question's `responses`
- for each new response, set a short `preview` sentence that appears before the full answer is expanded
- set each response header with `university`, `graduation_year`, and `intended_majors`
- set `endorsed: true` for any response that should always appear in the four-response preview

The page is designed so routine content edits do not require template changes.

TODO: add feedback button, add more questions, etc.
