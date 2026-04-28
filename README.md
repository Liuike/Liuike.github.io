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
The college narratives page lives at `docs/college-narratives.md` and pulls all of its content from `docs/_data/college_narratives.yml`.

To update it:
- edit the page intro or main-site link in `docs/_data/college_narratives.yml`
- add a new question by appending a new item under `questions`
- add a new response by appending a new item under that question's `responses`
- for each new response, set a short `preview` sentence that appears before the full answer is expanded
- set each response header with `university`, `graduation_year`, and `intended_majors`

The page is designed so routine content edits do not require template changes.

TODO: add feedback button, add more questions,background visual, randomize response ordering etc. 
