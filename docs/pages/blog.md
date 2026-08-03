---
layout: default
title: Blog
permalink: /blog/
---

<div class="landing-page blog-page">
  <header class="collection-hero">
    <div>
      <h1>Blog</h1>
    </div>
  </header>

  <div class="blog-layout">
    <div>
      {% if site.posts.size > 0 %}
        <ul class="landing-list blog-list">
          {% for post in site.posts %}
            <li class="post-item" data-tags="{% for tag in post.tags %}{{ tag | downcase | replace: ' ', '-' }} {% endfor %}">
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              <small class="entry-meta">{{ post.date | date: "%b %d, %Y" }}</small>
              {% if post.excerpt %}
                <p>{{ post.excerpt | strip_html | truncatewords: 25 }}</p>
              {% endif %}
            </li>
          {% endfor %}
        </ul>
      {% else %}
        <p class="page-intro">No posts yet. Check back soon!</p>
      {% endif %}
    </div>

    <aside class="blog-filter-panel" aria-label="Post categories">
      <div class="tag-filters">
        <div class="category-label">Filter</div>
        <button class="tag-btn active" type="button" data-tag="all" aria-pressed="true">All posts</button>
        {% assign tags = "" | split: "" %}
        {% for post in site.posts %}
          {% for tag in post.tags %}
            {% unless tags contains tag %}
              {% assign tags = tags | push: tag %}
            {% endunless %}
          {% endfor %}
        {% endfor %}
        {% assign tags = tags | sort %}
        {% for tag in tags %}
          <button class="tag-btn" type="button" data-tag="{{ tag | downcase | replace: ' ', '-' }}" aria-pressed="false">{{ tag }}</button>
        {% endfor %}
      </div>
    </aside>
  </div>
</div>
