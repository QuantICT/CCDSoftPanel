function fitElementToParent(el, padding) {
  let timeout = null;
  function resize() {
    if (timeout) clearTimeout(timeout);
    anime.set(el, { scale: 1 });
    let pad = padding || 0;
    let parentEl = el.parentNode;
    let elOffsetWidth = el.offsetWidth - pad;
    let parentOffsetWidth = parentEl.offsetWidth;
    let ratio = parentOffsetWidth / elOffsetWidth;
    timeout = setTimeout(anime.set(el, { scale: ratio / 22 }), 10);
  }
  resize();
  window.addEventListener('resize', resize);
}

let sphereEl = document.querySelector('.sphere-animation');
fitElementToParent(sphereEl);

let bowAnimation = anime.timeline({
  duration: 1000,
  easing: 'easeInOutSine',
  loop: true,
});

bowAnimation
  .add({
    targets: '#grey-bow-1',
    opacity: 1,
    keyframes: [
      { translateY: -360, fill: 'rgba(254,254,254,0)' },
      { translateY: 0, fill: 'rgba(156,154,155,1)' },
      { translateY: -180 },
      { translateY: 0 },
      { translateY: -90 },
      { translateY: 0 },
      { translateY: -45 },
      { translateY: 0 },
    ],
  })
  .add(
    {
      targets: '#grey-bow-2',
      opacity: 1,
      keyframes: [
        { translateY: -360, fill: 'rgba(254,254,254,0)' },
        { translateY: 0, fill: 'rgba(156,154,155,1)' },
        { translateY: -180 },
        { translateY: 0 },
        { translateY: -90 },
        { translateY: 0 },
        { translateY: -45 },
        { translateY: 0 },
      ],
    },
    '-=500'
  )
  .add(
    {
      targets: '#grey-bow-3',
      opacity: 1,
      keyframes: [
        { translateY: -360, fill: 'rgba(254,254,254,0)' },
        { translateY: 0, fill: 'rgba(156,154,155,1)' },
        { translateY: -180 },
        { translateY: 0 },
        { translateY: -90 },
        { translateY: 0 },
        { translateY: -45 },
        { translateY: 0 },
      ],
    },
    '-=500'
  )
  .add({
    targets: '#outer-bow',
    /*opacity: 1,*/
    keyframes: [{ opacity: 0.5 }, { opacity: 0 }, { opacity: 1 }],
    endDelay: 60000,
  });
