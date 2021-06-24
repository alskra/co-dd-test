import './intro.scss';

const introRunEl = document.querySelector('.intro__run');
const introRunContainerEl = document.querySelector('.intro__run-container');
const introItemEls = document.querySelectorAll('.intro__item');
let frameId;
let pos = 0;
let maxOffset;
let isInit = false;
let timeoutId;

const run = () => {
	if (pos > -maxOffset) {
		pos--;
	} else {
		pos = 0;
	}

	introRunContainerEl.style.transform = `translateX(${pos}px)`;
	frameId = requestAnimationFrame(run);
};

const updateRun = () => {
	maxOffset = introItemEls[introItemEls.length - 1].getBoundingClientRect().right
		- introItemEls[0].getBoundingClientRect().left;

	const needInit = maxOffset > introRunEl.clientWidth -
		parseInt(getComputedStyle(introRunEl).paddingLeft, 10) * 2;

	if (needInit && !isInit) {
		isInit = true;
		introItemEls.forEach((item) => {
			const cloneItem = item.cloneNode(true);

			cloneItem.classList.add('is-cloned');
			introRunContainerEl.append(cloneItem);
		});

		run();
	} else if (!needInit && isInit) {
		isInit = false;
		cancelAnimationFrame(frameId);
		introRunContainerEl.style.transform = '';
		document.querySelectorAll('.intro__item.is-cloned').forEach((item) => item.remove());
	}
};

window.addEventListener('resize', () => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(updateRun, 200);
});

updateRun();

document.querySelector('.intro__button-down').addEventListener('click', () => {
	document.querySelector('.app__container').scrollIntoView();
});
