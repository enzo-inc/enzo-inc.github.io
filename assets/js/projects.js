// Projects section interactions
document.addEventListener('DOMContentLoaded', function() {
  // See more toggle
  var toggle = document.getElementById('see-more-toggle');
  var hiddenContainer = document.getElementById('projects-hidden');

  if (toggle && hiddenContainer) {
    toggle.addEventListener('click', function() {
      var isExpanded = !hiddenContainer.classList.contains('expanded');
      var toggleText = toggle.querySelector('.toggle-text');

      if (isExpanded) {
        // Expanding: set max-height to actual content height
        hiddenContainer.style.maxHeight = hiddenContainer.scrollHeight + 'px';
        hiddenContainer.classList.add('expanded');
      } else {
        // Collapsing: set explicit height first, then collapse
        hiddenContainer.style.maxHeight = hiddenContainer.scrollHeight + 'px';
        // Force reflow
        hiddenContainer.offsetHeight;
        hiddenContainer.style.maxHeight = '0';
        hiddenContainer.classList.remove('expanded');
      }

      toggle.setAttribute('aria-expanded', isExpanded);
      if (toggleText) {
        toggleText.textContent = isExpanded ? 'See less' : 'See more';
      }
    });
  }

  // Link tag click handler (GitHub, Demo, Website)
  document.querySelectorAll('.link-tag').forEach(function(tag) {
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var href = this.getAttribute('data-href');
      if (href) {
        window.open(href, '_blank', 'noopener');
      }
    });
  });
});
