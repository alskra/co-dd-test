import './aside-nav.scss';

const asideNavLinkEls = document.querySelectorAll('.aside-nav__link');
let hash = decodeURI(location.hash);

const setActiveEl = (resetHash = true) => {
	if (!hash) {
		let el;

		document.querySelectorAll('.section__anchor').forEach((item) => {
			const rect = item.getBoundingClientRect();

			if (rect.top < 1) {
				el = item;
			}
		});

		if (el) {
			hash = `#${el.id}`;
		}
	}

	if (hash) {
		history.replaceState(null, null, hash);
		asideNavLinkEls.forEach((item) => {
			item.classList.toggle('is-active', decodeURI(item.hash) === hash);
		});
	}

	if (resetHash) {
		hash = '';
	}
};

let timeoutId;

window.addEventListener('scroll', () => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(setActiveEl, 100);
}, {passive: true});

window.addEventListener('resize', () => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(setActiveEl, 200);
});

asideNavLinkEls.forEach((item) => {
	item.addEventListener('click', () => {
		hash = decodeURI(item.hash);
		setActiveEl(false);
	});
});

setActiveEl(false);
