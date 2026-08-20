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
    {% assign active_year = "" %}
    <div class="project-ledger" aria-label="Project list">
      {% for project in sorted_projects %}
        {% assign project_year = project.date | date: "%Y" %}
        {% if project_year != active_year %}
          {% unless active_year == "" %}
            </ul>
          </section>
          {% endunless %}
          {% assign active_year = project_year %}
          <section class="project-year" aria-labelledby="projects-{{ project_year }}">
            <header class="project-year__header">
              <h2 id="projects-{{ project_year }}">{{ project_year }}</h2>
            </header>
            <ul class="project-index">
        {% endif %}
            <li class="project-item">
              <div class="project-entry__lead">
                {% if project.external_url %}
                  <h3 class="project-title">{{ project.title }}</h3>
                  <a class="project-link" href="{{ project.external_url }}" target="_blank" rel="noopener noreferrer">View Project</a>
                {% else %}
                  <h3 class="project-title">{{ project.title }}</h3>
                {% endif %}
              </div>
              <div class="project-summary">
                {% if project.content %}
                  {{ project.content | markdownify }}
                {% endif %}
              </div>
            </li>
      {% endfor %}
            </ul>
          </section>
    </div>
  {% else %}
    <p class="page-intro">No projects yet. Add your first one in the projects collection.</p>
  {% endif %}
</div>
