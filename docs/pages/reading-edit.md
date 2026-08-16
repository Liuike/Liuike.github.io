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

  <div class="reading-tools" aria-label="Reading list filters">
    <label class="reading-search" for="reading-search">
      <span>Search entries</span>
      <input id="reading-search" type="search" autocomplete="off" placeholder="Name, tag, or note" data-reading-search>
    </label>
    <div class="reading-filter-tags" data-reading-tags aria-label="Filter by tag"></div>
    <div class="reading-tools__actions">
      <button class="reading-button" type="button" data-reading-navigate="{{ '/reading/' | relative_url }}">Back to view</button>
      <button class="reading-button" type="button" data-reading-new>Add entry</button>
      <button class="reading-button" type="button" data-reading-to-read>To read</button>
    </div>
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

  <dialog class="reading-form-dialog" data-reading-form-dialog aria-labelledby="reading-form-heading">
    <form class="reading-form" data-reading-form>
      <input type="hidden" name="id" data-reading-id>
      <div class="reading-form__header">
        <div>
          <p class="entry-meta" data-reading-form-mode>New entry</p>
          <h2 data-reading-form-heading>Make a note</h2>
        </div>
        <div class="reading-form__header-actions">
          <button class="reading-button reading-button--danger" type="button" data-reading-delete hidden>Delete</button>
          <button class="reading-icon-button" type="button" data-reading-form-close aria-label="Close editor">×</button>
        </div>
      </div>

      <label for="reading-name">Name<input id="reading-name" name="name" maxlength="300" required data-reading-name></label>
      <label for="reading-link">Link<input id="reading-link" name="link" type="url" maxlength="2048" placeholder="https://…" required data-reading-link></label>
      <label class="reading-tags-field" for="reading-tags">Tags<span class="reading-field-note">Separate tags with commas. Existing tags appear as you type.</span><input id="reading-tags" name="tags" maxlength="1600" autocomplete="off" aria-autocomplete="list" aria-expanded="false" data-reading-tags-input><div class="reading-tag-suggestions" data-reading-tag-suggestions role="listbox" hidden></div></label>
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
  </dialog>

  <section class="to-read" aria-labelledby="to-read-heading" data-to-read tabindex="-1">
    <div class="to-read__header"><div><p class="entry-meta">Private queue</p><h2 id="to-read-heading">To read</h2></div></div>
    <form class="to-read__form" data-to-read-form>
      <label>Title<input name="title" maxlength="300" required placeholder="Paper or article title"></label>
      <label>Link <span>(optional)</span><input name="link" type="url" maxlength="2048" placeholder="https://…"></label>
      <label class="reading-tags-field">Tags<span class="reading-field-note">Separate tags with commas.</span><input name="tags" maxlength="1600" autocomplete="off" aria-autocomplete="list" aria-expanded="false" data-to-read-tags-input><div class="reading-tag-suggestions" data-to-read-tag-suggestions role="listbox" hidden></div></label>
      <button class="reading-button" type="submit">Add to queue</button>
    </form>
    <p class="reading-save-status" data-to-read-status role="status"></p>
    <ol class="to-read__list" data-to-read-list></ol>
  </section>
</section>
