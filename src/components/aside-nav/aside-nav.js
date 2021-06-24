import './aside-nav.scss';

const asideNavLinkEls = document.querySelectorAll('.aside-nav__link');
let hash = decodeURI(location.hash);

const setActiveEl = () => {
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

	hash = '';
};

let timeoutId;

const debounceSetActiveEl = () => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(setActiveEl, 100);
};

debounceSetActiveEl();

window.addEventListener('popstate', () => {
	hash = decodeURI(location.hash);
	debounceSetActiveEl();
});

asideNavLinkEls.forEach((item) => {
	item.addEventListener('click', () => {
		hash = decodeURI(item.hash);
		debounceSetActiveEl();
	});
});

window.addEventListener('scroll', debounceSetActiveEl, {passive: true});
window.addEventListener('resize', debounceSetActiveEl);
