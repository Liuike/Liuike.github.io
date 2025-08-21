---
layout: default
title: Blog
permalink: /blog/
---

<div class="main-content">
  <div class="container">
    <h1>Blog</h1>
    
    <div class="intro">
      <p>Welcome to my blog! Here you'll find my thoughts on anything that comes to mind!</p>
    </div>

    {% if site.posts.size > 0 %}
      <ul class="post-list">
        {% for post in site.posts %}
          <li>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            <small>· {{ post.date | date: "%b %d, %Y" }}</small>
            {% if post.excerpt %}
              <p>{{ post.excerpt | strip_html | truncatewords: 25 }}</p>
            {% endif %}
          </li>
        {% endfor %}
      </ul>
    {% else %}
      <div class="intro">
        <p>No posts yet. Check back soon!</p>
      </div>
    {% endif %}

    <div class="links">
      <a href="/" class="link">← Back to home</a>
    </div>
  </div>
</div>
