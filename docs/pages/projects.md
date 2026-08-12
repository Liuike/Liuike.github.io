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
    {% assign sorted_projects = site.projects | sort: "date" | reverse %}
    <ul class="project-index" aria-label="Project list">
      {% for project in sorted_projects %}
        <li class="project-item">
          <h2 class="project-title">{{ project.title }}</h2>
          <div class="project-summary">
            {% if project.content %}
              {{ project.content | markdownify }}
            {% endif %}
          </div>
          {% if project.external_url %}
            <a class="project-link" href="{{ project.external_url }}" target="_blank" rel="noopener noreferrer">View Project</a>
          {% endif %}
        </li>
      {% endfor %}
    </ul>
  {% else %}
    <p class="page-intro">No projects yet. Add your first one in the projects collection.</p>
  {% endif %}
</div>
