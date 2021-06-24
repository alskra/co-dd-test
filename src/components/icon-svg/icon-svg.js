import './icon-svg.scss';

const requireIcon = require.context(
	'../../images/icons/svg?raw',
	false,
	/\.svg$/,
);

const icons = {};

requireIcon.keys().forEach((iconPath) => {
	const iconName = iconPath
		.split('/')
		.pop()
		.replace(/\.\w+$/, '');

	icons[iconName] = requireIcon(iconPath).default || requireIcon(iconPath);
});

class IconSvg extends HTMLElement {
	static get observedAttributes() {
		return ['name'];
	}

	get name() {
		return this.getAttribute('name');
	}

	update() {
		this.innerHTML = icons[this.name];
		this.svgEl = this.querySelector('svg');
		[
			'width',
			'height',
		].forEach((attr) => this.svgEl.removeAttribute(attr));
	}

	attributeChangedCallback(name) {
		if (name === 'name') {
			this.update();
		}
	}
}

customElements.define('icon-svg', IconSvg);

export default IconSvg;
export {icons};
