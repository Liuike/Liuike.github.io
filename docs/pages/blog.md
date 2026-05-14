---
layout: default
title: Blog
permalink: /blog/
---

<div class="main-content blog-main-content">
  <div class="container">
      <div class="blog-header">
        <div class="blog-header-content">
          <h1>Blog</h1>
          
          <div class="intro">
            <p>Welcome to my blog! Here you'll find my thoughts on anything that comes to mind!</p>
          </div>
        </div>
      </div>

      {% if site.posts.size > 0 %}
        <ul class="post-list">
          {% for post in site.posts %}
            <li class="post-item" data-tags="{% for tag in post.tags %}{{ tag | downcase | replace: ' ', '-' }} {% endfor %}">
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

  <div class="blog-sidebar-external">
    <div class="tag-filters">
      <div class="category-label">Category</div>
      <button class="tag-btn active" data-tag="all">All Posts</button>
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
        <button class="tag-btn" data-tag="{{ tag | downcase | replace: ' ', '-' }}">{{ tag }}</button>
      {% endfor %}
    </div>
  </div>

  <script>
    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        // Update active button
        document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Filter posts
        const selectedTag = this.dataset.tag;
        document.querySelectorAll('.post-item').forEach(post => {
          if (selectedTag === 'all') {
            post.style.display = '';
          } else {
            const postTags = post.dataset.tags.split(' ').filter(t => t);
            post.style.display = postTags.includes(selectedTag) ? '' : 'none';
          }
        });
      });
    });
  </script>

</div>
