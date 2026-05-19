---
layout: default
title: Projects
permalink: /projects/
---

<div class="main-content projects-main-content">
  <div class="container">
    <h1>Projects</h1>

    <div class="intro">
      <p>A collection of things I've built.</p>
    </div>

    {% if site.projects and site.projects.size > 0 %}
      {% assign sorted_projects = site.projects | sort: "title" %}
      <ul class="post-list">
        {% for project in sorted_projects %}
          <li class="post-item">
            {% if project.external_url %}
              <a href="{{ project.external_url }}" target="_blank" rel="noopener">{{ project.title }}</a>
            {% else %}
              <span>{{ project.title }}</span>
            {% endif %}
            {% if project.content %}
              {{ project.content | markdownify }}
            {% endif %}
          </li>
        {% endfor %}
      </ul>
    {% else %}
      <div class="intro">
        <p>No projects yet. Add your first one in the projects collection.</p>
      </div>
    {% endif %}

    <div class="links">
      <a href="/" class="link">← Back to home</a>
    </div>
  </div>
</div>
