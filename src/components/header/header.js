import './header.scss';

const header = document.querySelector('.header');

function toggleTransparent() {
	header.classList.toggle('header--transparent', pageYOffset === 0);
}

window.addEventListener('scroll', toggleTransparent, {passive: true});
