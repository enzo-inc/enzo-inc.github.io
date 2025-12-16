---
layout: page
title: Writings
permalink: /blog/
---

Thoughts, ideas, and insights from building code review systems.

{% for post in site.posts %}
<div class="post-item">
  <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
  <a href="{{ post.url | relative_url }}" class="post-link">{{ post.title | escape }}</a>
</div>
{% endfor %}
