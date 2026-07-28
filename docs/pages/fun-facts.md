---
layout: default
title: Fun
permalink: /fun-facts/
---

<div class="main-content">
  <div class="container">
    <h1>Fun</h1>

    <ul class="post-list">
      <li>
        <small>I'm really into modern tetris! I used to be top <a href="https://ch.tetr.io/u/liuike" target="_blank" rel="noopener noreferrer">5% worldwide</a>, but now I play less...</small>
      </li>
      <li>
        <small>I have a cat called <button class="clickable-fore" type="button" data-dropdown="fore-image-dropdown" aria-expanded="false">Fore</button>, but at home we call him 福贵 (fú guì).</small>
        <div id="fore-image-dropdown" class="image-dropdown" style="display: none;">
          <img src="/assets/img/fore.jpg" alt="Fore the cat" />
        </div>
      </li>
      <li>
        <small>I picked up fencing in middle school and loved it ever since!</small>
      </li>
      <li>
        <small>You should listen to <a href="https://www.youtube.com/channel/UC6LfIWARVzv6l2OexwbKNHw" target="_blank" rel="noopener noreferrer">酔シグレ: Yoishigure</a>! I especially like this <button class="clickable-music" type="button" data-dropdown="music-player-dropdown" aria-expanded="false">one</button>.</small>
        <div id="music-player-dropdown" class="music-dropdown" style="display: none;">
          <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/i3fNQFF0Wy0?rel=0&modestbranding=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </li>
      <li>
        <small>Favorite study spot (as of May 2026): The <button class="clickable-fore" type="button" data-dropdown="rock-basement-dropdown" aria-expanded="false">Rock basement stacks</button>, or near the <button class="clickable-fore" type="button" data-dropdown="rock-east-asian-dropdown" aria-expanded="false">East Asian Collection on third floor</button>!</small>
        <div id="rock-basement-dropdown" class="image-dropdown" style="display: none;">
          <img src="/assets/img/rock-space-basement.jpg" alt="Rock basement stacks" />
          <p><small class="image-credit">Rock images courtesy of <a href="https://library.brown.edu/create/rock50/rock-spaces/" target="_blank" rel="noopener">Brown University Library</a>.</small></p>
        </div>
        <div id="rock-east-asian-dropdown" class="image-dropdown" style="display: none;">
          <img src="/assets/img/rock-space-east-asian.jpg" alt="Rock East Asian Collection" />
          <p><small class="image-credit">Rock images courtesy of <a href="https://library.brown.edu/create/rock50/rock-spaces/" target="_blank" rel="noopener">Brown University Library</a>.</small></p>
        </div>
      </li>
    </ul>

    <div class="intro">
      <p><em>This list will be periodically updated...</em></p>
    </div>

    <div class="links">
      <a href="/" class="link">← Back to home</a>
    </div>
  </div>
</div>

<script>
function closeAllDropdowns() {
  const dropdowns = [
    'fore-image-dropdown',
    'music-player-dropdown',
    'rock-basement-dropdown',
    'rock-east-asian-dropdown'
  ];

    dropdowns.forEach(id => {
      const dropdown = document.getElementById(id);
      if (dropdown) {
        dropdown.style.display = 'none';
      }

      const toggle = document.querySelector(`[data-dropdown="${id}"]`);
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function toggleDropdown(id, toggle) {
  const dropdown = document.getElementById(id);
  if (!dropdown) {
    return;
  }

    const isOpen = dropdown.style.display === 'block';
    closeAllDropdowns();
    dropdown.style.display = isOpen ? 'none' : 'block';
    toggle.setAttribute('aria-expanded', String(!isOpen));
  }

  document.querySelectorAll('[data-dropdown]').forEach(toggle => {
    toggle.addEventListener('click', () => toggleDropdown(toggle.dataset.dropdown, toggle));
  });
</script>
