window.human = false;

let canvasEl = document.querySelector('.fireworks');
let ctx = canvasEl.getContext('2d');
let numberOfParticles = 30;
let pointerX = 0;
let pointerY = 0;
let tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
let colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
// let colors = ['#F29200', '#FFC266'];

const setCanvasSize = () => {
	canvasEl.width = window.innerWidth * 2;
	canvasEl.height = window.innerHeight * 2;
	canvasEl.style.width = window.innerWidth + 'px';
	canvasEl.style.height = window.innerHeight + 'px';
	canvasEl.getContext('2d').scale(2, 2);
}

const updateCoords = (e) => {
	pointerX = e.clientX || e.touches[0].clientX;
	pointerY = e.clientY || e.touches[0].clientY;
}

const setParticleDirection = (p) => {
	let angle = anime.random(0, 360) * Math.PI / 180;
	let value = anime.random(50, 120);
	let radius = [-1, 1][anime.random(0, 1)] * value;
	return {
		x: p.x + radius * Math.cos(angle),
		y: p.y + radius * Math.sin(angle)
	}
}

const createParticle = (x, y) => {
	let p = {};
	p.x = x;
	p.y = y;
	p.color = colors[anime.random(0, colors.length - 1)];
	p.radius = anime.random(8, 10);
	p.endPos = setParticleDirection(p);
	p.draw = () => {
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
		ctx.fillStyle = p.color;
		ctx.fill();
	}
	return p;
}

const createCircle = (x, y) => {
	let p = {};
	p.x = x;
	p.y = y;
	p.color = 'transparent';
	p.radius = 0.1;
	p.alpha = 0.5;
	p.lineWidth = 6;
	p.draw = () => {
		ctx.globalAlpha = p.alpha;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
		ctx.lineWidth = p.lineWidth;
		ctx.strokeStyle = p.color;
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
	return p;
}

const renderParticle = (anim) => {
	for (let i = 0; i < anim.animatables.length; i++) anim.animatables[i].target.draw();
}

const animateParticles = (x, y) => {
	let circle = createCircle(x, y);
	let particles = [];
	for (let i = 0; i < numberOfParticles; i++) particles.push(createParticle(x, y));
	anime.timeline().add({
		targets: particles,
		x: (p) => p.endPos.x,
		y: (p) => p.endPos.y,
		radius: 0.1,
		duration: anime.random(1200, 1800),
		easing: 'easeOutExpo',
		update: renderParticle
	})
	.add({
		targets: circle,
		radius: anime.random(80, 160),
		lineWidth: 0,
		alpha: {
			value: 0,
			easing: 'linear',
			duration: anime.random(600, 800),
		},
		duration: anime.random(1200, 1800),
		easing: 'easeOutExpo',
		update: renderParticle,
		offset: 0
	});
}

let render = anime({
	duration: Infinity,
	update: () => {
		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
	}
});

document.addEventListener(tap, function(e) {
	window.huma = true;
	render.play();
	updateCoords(e);
	animateParticles(pointerX, pointerY);
}, false);

let centerX = window.innerWidth / 2;
let centerY = window.innerHeight / 2;

function autoClick() {
	if(window.human) return;
	animateParticles(
		anime.random(centerX - 50, centerY + 50),
		anime.random(centerY - 50, centerY + 50)
	);
	anime({ duration: 200 });
}

// autoClick();
setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);
