import './aside-nav.scss';

const asideNavLinkEls = document.querySelectorAll('.aside-nav__link');

const setActiveEl = () => {
	let el;

	document.querySelectorAll('.section__anchor').forEach((item) => {
		const rect = item.getBoundingClientRect();

		if (rect.top < 1) {
			el = item;
		}
	});

	if (el) {
		history.replaceState(null, null, `#${el.id}`);
		asideNavLinkEls.forEach((item) => {
			item.classList.toggle('is-active', item.getAttribute('href').indexOf(`#${el.id}`) !== -1);
		});
	}
};

let timeout;

window.addEventListener('scroll', () => {
	clearTimeout(timeout);
	timeout = setTimeout(setActiveEl, 100);
}, {passive: true});

window.addEventListener('resize', setActiveEl);

setActiveEl();
