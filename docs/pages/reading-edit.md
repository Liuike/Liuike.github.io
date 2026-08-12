---
layout: default
title: Edit Reading List
permalink: /reading/edit/
reading_list: true
search: false
sitemap: false
---

<section class="landing-page reading-page reading-editor" data-reading-list-editor>
  <header class="collection-hero">
    <div>
      <h1>Reading list</h1>
    </div>
  </header>

  <div class="reading-editor-layout">
    <aside class="reading-editor-index" aria-label="Saved entries">
      <div class="reading-editor-index__header">
        <span class="entry-meta">Entries</span>
        <button class="reading-button reading-button--quiet" type="button" data-reading-new>New entry</button>
      </div>
      <p class="reading-status" data-reading-status role="status">Loading entries…</p>
      <div class="reading-editor-list" data-reading-editor-list></div>
    </aside>

    <form class="reading-form" data-reading-form>
      <input type="hidden" name="id" data-reading-id>
      <div class="reading-form__header">
        <div>
          <p class="entry-meta" data-reading-form-mode>New entry</p>
          <h2 data-reading-form-heading>Make a note</h2>
        </div>
        <button class="reading-button reading-button--danger" type="button" data-reading-delete hidden>Delete</button>
      </div>

      <label for="reading-name">Name<input id="reading-name" name="name" maxlength="300" required data-reading-name></label>
      <label for="reading-link">Link<input id="reading-link" name="link" type="url" maxlength="2048" placeholder="https://…" required data-reading-link></label>
      <label for="reading-tags">Tags<span class="reading-field-note">Separate tags with commas.</span><input id="reading-tags" name="tags" maxlength="1600" data-reading-tags-input></label>
      <label for="reading-notes">Reading notes<span class="reading-field-note">Markdown is supported; HTML stays plain text.</span><textarea id="reading-notes" name="notes_markdown" rows="14" maxlength="100000" data-reading-notes></textarea></label>

      <div class="reading-form__actions">
        <button class="reading-button" type="submit" data-reading-save>Save entry</button>
        <span class="reading-save-status" data-reading-save-status role="status"></span>
      </div>
      <section class="reading-preview" aria-labelledby="reading-preview-heading">
        <p class="entry-meta">Preview</p>
        <h3 id="reading-preview-heading">Notes</h3>
        <div data-reading-preview></div>
      </section>
    </form>
  </div>
</section>
