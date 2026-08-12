---
layout: default
title: Reading List
permalink: /reading/
reading_list: true
search: false
sitemap: false
---

<section class="landing-page reading-page" data-reading-list-public>
  <header class="collection-hero">
    <div>
      <h1>Reading list</h1>
    </div>
    <a class="reading-editor-link" href="{{ '/reading/edit/' | relative_url }}">Edit list</a>
  </header>

  <div class="reading-tools" aria-label="Reading list filters">
    <label class="reading-search" for="reading-search">
      <span>Search entries</span>
      <input id="reading-search" type="search" autocomplete="off" placeholder="Name, tag, or note" data-reading-search>
    </label>
    <div class="reading-filter-tags" data-reading-tags aria-label="Filter by tag"></div>
  </div>

  <p class="reading-status" data-reading-status role="status">Loading reading list…</p>
  <div class="reading-catalogue" data-reading-results aria-live="polite"></div>
  <dialog class="reading-note-dialog" data-reading-note-dialog aria-labelledby="reading-note-title">
    <div class="reading-note-dialog__header">
      <h2 id="reading-note-title" data-reading-note-title>Reading notes</h2>
      <button class="reading-icon-button" type="button" data-reading-note-close aria-label="Close notes">×</button>
    </div>
    <div data-reading-note-content></div>
  </dialog>
</section>
