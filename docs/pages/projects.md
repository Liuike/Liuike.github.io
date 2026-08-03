---
layout: default
title: Projects
permalink: /projects/
---

<div class="landing-page projects-page">
  <header class="collection-hero">
    <div>
      <h1>Projects</h1>
    </div>
  </header>

  {% if site.projects and site.projects.size > 0 %}
    {% assign sorted_projects = site.projects | sort: "title" %}
    <ul class="project-index" aria-label="Project list">
      {% for project in sorted_projects %}
        <li class="project-item">
          {% if project.external_url %}
            <a href="{{ project.external_url }}" target="_blank" rel="noopener noreferrer">{{ project.title }}</a>
          {% else %}
            <span>{{ project.title }}</span>
          {% endif %}
          <small class="entry-meta">Project / {{ forloop.index | prepend: "0" | slice: -2, 2 }}</small>
          <div class="project-summary">
            {% if project.content %}
              {{ project.content | markdownify }}
            {% endif %}
          </div>
        </li>
      {% endfor %}
    </ul>
  {% else %}
    <p class="page-intro">No projects yet. Add your first one in the projects collection.</p>
  {% endif %}
</div>
