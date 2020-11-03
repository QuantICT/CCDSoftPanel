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
		timeout = setTimeout(anime.set(el, { scale: ratio /22}), 10);
	}
	resize();
	window.addEventListener('resize', resize);
}


let sphereAnimation = (function() {
	
	let lineDrawing = anime({
    	targets: '#lineDrawing .lines .my-path',
    	strokeDashoffset: [anime.setDashoffset, 0],
    	fill: '#918f90',
    	easing: 'easeInOutSine',
    	duration: 10000,
    	delay: function (el, i) { return i * 2500; },
    	direction: 'alternate',
    	autoplay: false,
    	loop: true,
  	});

  	let circleDrawing = anime({
		targets: '#lineDrawing .lines .my-circle',
		strokeDashoffset: [anime.setDashoffset, 2],
		fill: '#f68712',
		easing: 'easeInOutSine',
		duration: 5000,
		delay: function (el, i) { return i * 25000; },
		direction: 'alternate',
		autoplay: false,
		loop: false,
  	});


	let sphereEl = document.querySelector('.sphere-animation');
  	let spherePathEls = sphereEl.querySelectorAll('.sphere path');
 	let pathLength = spherePathEls.length;
	let hasStarted = false;
	let animations = [];

	fitElementToParent(sphereEl);

	
	let breathAnimation = anime({
		begin: function() {
			for (let i = 0; i < pathLength; i++) {
				animations.push(
          anime({
            targets: spherePathEls[i],
            stroke: {
              value: ['rgba(220,20,60,1)', 'rgba(80,80,80,1)'],
              duration: 1000,
            },
            translateX: [20, -4],
            translateY: [20, -4],
            easing: 'easeOutQuint',
            autoplay: false,
          })
        );
			}
		},
		update: function(ins) {
			animations.forEach(function(animation, i) {
				let percent = (1 - Math.sin((i * .35) + (.0022 * ins.currentTime))) / 1.2;
				animation.seek(animation.duration * percent);
			});
		},
		duration: Infinity,
		autoplay: false
	});
/*	
	let introAnimation = anime.timeline({
		autoplay: false
	})
	.add({
		targets: spherePathEls,
		strokeDashoffset: {
			value: [anime.setDashoffset, 0],
			duration: 3900,
			easing: 'easeInOutCirc',
			delay: anime.stagger(190, { direction: 'reverse' }),
		},
		duration: 2000,
		delay: anime.stagger(60, { direction: 'reverse' }),
		easing: 'linear'
	}, 0);*/

/*	let shadowAnimation = anime({
		targets: '#sphereGradient',
		x1: '100%',
		x2: '100%',
		y1: '100%',
		y2: '100%',
		duration: 30000,
		easing: 'easeOutQuint',
		autoplay: false
	}, 0);*/

	function init() {
		circleDrawing.play();
		lineDrawing.play();
		breathAnimation.play();
		// introAnimation.play();
		//breathAnimation.play();
		//shadowAnimation.play();
		
	}

	init();
})();
