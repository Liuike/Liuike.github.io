---
layout: college_narratives
title: College Application Narratives
permalink: /college-narratives/
---

{% assign narratives = site.data.college_narratives %}

<div class="main-content narratives-page">
  <div class="container narratives-container">
    <div class="narratives-hero">
      <h1>{{ narratives.title }}</h1>
      <div class="intro">
        <p>{{ narratives.intro | newline_to_br }}</p>
        <p>{{ narratives.intro_secondary | newline_to_br }}</p>
      </div>
    </div>

    <section class="narratives-jump-list" aria-labelledby="questions-heading">
      <h2 id="questions-heading">Questions</h2>
      <ul class="question-links">
        {% for question in narratives.questions %}
          <li><a href="#{{ question.id }}">{{ question.prompt }}</a></li>
        {% endfor %}
      </ul>
    </section>

    <div class="narratives-sections">
      {% for question in narratives.questions %}
        <section class="question-section" id="{{ question.id }}">
          <div class="question-header">
            <p class="question-label">Question {{ forloop.index }}</p>
            <h2>{{ question.prompt }}</h2>
          </div>

          <div class="response-list">
            {% if question.responses and question.responses.size > 0 %}
              {% for response in question.responses %}
                <details class="response-card">
                  <summary class="response-summary">
                    <div class="response-meta">
                      <p class="response-author">
                        {% if response.university %}{{ response.university }}{% endif %}{% if response.university and response.graduation_year %}, Class of {{ response.graduation_year }}{% endif %}{% if response.graduation_year and response.university == nil %}Class of {{ response.graduation_year }}{% endif %}
                      </p>
                    </div>
                    <p class="response-preview">"{{ response.preview }}"</p>
                  </summary>

                  <div class="response-body">
                    <p>{{ response.text }}</p>
                  </div>
                </details>
              {% endfor %}
            {% else %}
              <p class="response-empty">No narratives added for this question yet.</p>
            {% endif %}
          </div>
        </section>
      {% endfor %}
    </div>

    <div class="narratives-bottom-actions">
      <a href="{{ narratives.main_site_url }}" class="link narratives-return-link">{{ narratives.main_site_label }}</a>
    </div>
  </div>
</div>
