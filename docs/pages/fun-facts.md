---
layout: default
title: Fun
permalink: /fun-facts/
---

<div class="landing-page fun-page">
  <header class="collection-hero">
    <div>
      <h1>Fun</h1>
    </div>
  </header>

  <ul class="fun-stream">
    <li>
      <p>I'm really into modern tetris! I used to be top <a href="https://ch.tetr.io/u/liuike" target="_blank" rel="noopener noreferrer">5% worldwide</a>, but now I play less...</p>
    </li>
    <li>
      <p>I have a cat called <button class="clickable-fore" type="button" data-dropdown="fore-image-dropdown" aria-expanded="false">Fore</button>, but at home we call him 福贵 (fú guì).</p>
      <div id="fore-image-dropdown" class="image-dropdown" hidden>
        <img src="/assets/img/fore.jpg" alt="Fore the cat" />
      </div>
    </li>
    <li>
      <p>I picked up fencing in middle school and loved it ever since!</p>
    </li>
    <li>
      <p>You should listen to <a href="https://www.youtube.com/channel/UC6LfIWARVzv6l2OexwbKNHw" target="_blank" rel="noopener noreferrer">酔シグレ: Yoishigure</a>! I especially like this <button class="clickable-music" type="button" data-dropdown="music-player-dropdown" aria-expanded="false">one</button>.</p>
      <div id="music-player-dropdown" class="music-dropdown" hidden>
        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/i3fNQFF0Wy0?rel=0&modestbranding=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
    </li>
    <li>
      <p>Favorite study spot (as of May 2026): The <button class="clickable-fore" type="button" data-dropdown="rock-basement-dropdown" aria-expanded="false">Rock basement stacks</button>, or near the <button class="clickable-fore" type="button" data-dropdown="rock-east-asian-dropdown" aria-expanded="false">East Asian Collection on third floor</button>!</p>
      <div id="rock-basement-dropdown" class="image-dropdown" hidden>
        <img src="/assets/img/rock-space-basement.jpg" alt="Rock basement stacks" />
        <p class="image-credit">Rock images courtesy of <a href="https://library.brown.edu/create/rock50/rock-spaces/" target="_blank" rel="noopener noreferrer">Brown University Library</a>.</p>
      </div>
      <div id="rock-east-asian-dropdown" class="image-dropdown" hidden>
        <img src="/assets/img/rock-space-east-asian.jpg" alt="Rock East Asian Collection" />
        <p class="image-credit">Rock images courtesy of <a href="https://library.brown.edu/create/rock50/rock-spaces/" target="_blank" rel="noopener noreferrer">Brown University Library</a>.</p>
      </div>
    </li>
  </ul>
</div>

<script>
  const dropdownToggles = document.querySelectorAll('[data-dropdown]');

  function closeAllDropdowns() {
    dropdownToggles.forEach((toggle) => {
      const dropdown = document.getElementById(toggle.dataset.dropdown);
      if (dropdown) dropdown.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const dropdown = document.getElementById(toggle.dataset.dropdown);
      if (!dropdown) return;
      const shouldOpen = dropdown.hidden;
      closeAllDropdowns();
      dropdown.hidden = !shouldOpen;
      toggle.setAttribute('aria-expanded', String(shouldOpen));
    });
  });
</script>
