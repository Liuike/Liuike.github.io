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
        <small>I'm really into modern tetris! I used to be top <a href="https://ch.tetr.io/u/liuike" target="_blank">5% worldwide</a>, but now I play less...</small>
      </li>
      <li>
        <small>I have a cat called <span class="clickable-fore" onclick="toggleForeImage()">Fore</span>, but at home we call him 福贵 (fú guì).</small>
        <div id="fore-image-dropdown" class="image-dropdown" style="display: none;">
          <img src="/assets/img/fore.jpg" alt="Fore the cat" />
        </div>
      </li>
      <li>
        <small>I picked up fencing in middle school and loved it ever since!</small>
      </li>
      <li>
        <small>You should listen to <a href="https://www.youtube.com/channel/UC6LfIWARVzv6l2OexwbKNHw" target="_blank">酔シグレ: Yoishigure</a>! I especially like this <span class="clickable-music" onclick="toggleMusicPlayer()">one</span>.</small>
        <div id="music-player-dropdown" class="music-dropdown" style="display: none;">
          <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/i3fNQFF0Wy0?rel=0&modestbranding=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
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
function toggleForeImage() {
    const dropdown = document.getElementById('fore-image-dropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

function toggleMusicPlayer() {
    const dropdown = document.getElementById('music-player-dropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}
</script>
