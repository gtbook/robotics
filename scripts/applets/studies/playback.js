'use strict';

function mountMotionPlayback({section, prefix, duration, views, config, onProgress}) {
  const get = id => document.getElementById(`${prefix}-${id}`);
  const times = views.map(() => 0);
  const playing = views.map(() => false);
  const playAll = get('play');
  const scrubAll = get('scrub');
  const speedButtons = section.querySelectorAll('[data-speed]');
  let focus = 0, speed = 1, timer, last;

  const formatTime = seconds => [Math.floor(seconds / 60), Math.floor(seconds) % 60]
    .map(part => String(part).padStart(2, '0')).join(':');
  const sliderValue = seconds => String(Math.round(1000 * seconds / duration));
  const sliderTime = input => Number(input.value) * duration / 1000;

  const minis = [...section.querySelectorAll('.card')].map((card, i) => {
    const controls = document.createElement('div');
    controls.className = 'mini';
    controls.innerHTML = `<button class="mplay" aria-label="Play this animation">▶</button><input class="range mrange" type="range" min="0" max="1000" value="0" step="1" aria-label="Set time for this view"><span class="time mtime">00:00</span><button class="mreset" title="Restart this animation" aria-label="Restart this animation">↺</button>`;
    card.querySelector('.canvaswrap').after(controls);
    const play = controls.querySelector('.mplay');
    const scrub = controls.querySelector('.mrange');
    play.onclick = () => {
      playing[i] = !playing[i];
      focus = i;
      updatePlayback();
    };
    scrub.oninput = () => {
      times[i] = sliderTime(scrub);
      playing[i] = false;
      focus = i;
      updatePlayback();
    };
    controls.querySelector('.mreset').onclick = () => {
      times[i] = 0;
      focus = i;
      render();
    };
    return {play, scrub, elapsed: controls.querySelector('.mtime')};
  });

  function render() {
    views.forEach((draw, i) => {
      draw(times[i]);
      minis[i].scrub.value = sliderValue(times[i]);
      minis[i].elapsed.textContent = formatTime(times[i]);
    });
    scrubAll.value = sliderValue(times[focus]);
    get('elapsed').textContent = formatTime(times[focus]);
    onProgress?.(times[focus]);
  }

  function tick() {
    const now = performance.now();
    const elapsed = Math.min(now - last, 100) * speed / 1000;
    last = now;
    for (let i = 0; i < views.length; i++) {
      if (playing[i]) times[i] = (times[i] + elapsed) % duration;
    }
    render();
  }

  function updatePlayback() {
    const count = playing.filter(Boolean).length;
    if (count && timer === undefined) {
      last = performance.now();
      timer = setInterval(tick, 1000 / 30);
    } else if (!count && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }

    playAll.textContent = count ? 'Ⅱ Pause' : '▶ Play all';
    playAll.setAttribute('aria-label', count ? 'Pause all three' : 'Play all three');
    get('playlabel').textContent = count === views.length ? 'Playing' : count ? `${count} of ${views.length} playing` : 'Paused';
    minis.forEach(({play}, i) => {
      play.textContent = playing[i] ? 'Ⅱ' : '▶';
      play.setAttribute('aria-label', playing[i] ? 'Pause this animation' : 'Play this animation');
    });
    render();
  }

  function seekAll(time) {
    times.fill(time);
    playing.fill(false);
    updatePlayback();
  }

  playAll.onclick = () => {
    playing.fill(!playing.some(Boolean));
    updatePlayback();
  };
  scrubAll.oninput = () => seekAll(sliderTime(scrubAll));
  get('restart').onclick = () => {times.fill(0); render();};
  speedButtons.forEach(button => {
    button.onclick = () => {
      speed = Number(button.dataset.speed);
      speedButtons.forEach(other => other.classList.toggle('selected', other === button));
    };
  });
  for (const option of Object.keys(config)) {
    const checkbox = get(option);
    checkbox.onchange = () => {config[option] = checkbox.checked; render();};
  }
  window.addEventListener('keydown', event => {
    if (event.code === 'Space' && !event.repeat && !event.target.closest?.('button, input')) {
      event.preventDefault();
      playAll.click();
    }
  });

  updatePlayback();
  const observer = new ResizeObserver(render);
  section.querySelectorAll('.canvaswrap').forEach(canvas => observer.observe(canvas));
  return seekAll;
}
