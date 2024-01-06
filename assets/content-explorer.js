// TODO: Better ordering algorithm
// TODO: Train cars + train sets

const listContainer = document.getElementById('list-container');
const COMPENSATION_TEXTS = { free: 'Download (free)', donation: 'Download (donation-ware)', commercial: 'Buy (commercial)' };

const _routes = await fetch('https://static.openrails.org/content/routes.json');
const routes = (await _routes.json()).map((item, index) => ({ index, ...item }));

let selectedCard = 'routes';
let filters = ['free', 'donation', 'commercial'];

const addOrRemove = (arr, item) => (arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);

function fuzzySearch(input, data, keys) {
	// Convert input to lowercase for case-insensitive search
	const searchQueries = input.toLowerCase().split(/\s+/);

	// Filter the data array based on the fuzzy search
	const result = data.filter((item) => {
		// Check if all search queries are present in any of the keys
		return searchQueries.every((searchQuery) => {
			// Check each key in the keys array
			return keys.some((key) => {
				// Get the nested value if key is nested
				const value = key.split('.').reduce((acc, currentKey) => {
					return acc ? acc[currentKey] : undefined;
				}, item);

				// If value is a string, check if it includes the search query
				if (typeof value === 'string') {
					return value.toLowerCase().includes(searchQuery);
				}

				return false;
			});
		});
	});

	return result;
}

// Modified function from https://stackoverflow.com/a/18650828
function formatBytes(bytes, decimals = 2) {
	if (!+bytes) return '0 Bytes';

	const k = 1000;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const selectionCards = document.getElementsByClassName('selection');
for (const card of selectionCards) {
	card.addEventListener('click', (e) => selectCard(e));
}

const filterButtons = document.getElementsByClassName('filter-btn');
for (const btn of filterButtons) {
	btn.addEventListener('click', (e) => toggleFilter(e));
}

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', generateList);

function selectCard(e) {
	for (const card of selectionCards) {
		card.classList.remove('selected');
	}

	e.currentTarget.classList.add('selected');
	selectedCard = e.currentTarget.dataset.card;
}

function toggleFilter(e) {
	const filterType = e.target.dataset.type;
	if (filters.length === 1 && filters.includes(filterType)) return;

	e.target.toggleAttribute('data-secondary');
	filters = addOrRemove(filters, filterType);

	generateList();
}

function updateContainer(elementsArray) {
	const existingChildren = Array.from(listContainer.children);

	// Remove elements that are not in the new array
	existingChildren.forEach((child) => {
		const index = Number(child.dataset.index);
		if (!elementsArray.some((e) => Number(e.dataset.index) === index)) {
			listContainer.removeChild(child);
		}
	});

	// Insert new elements at their correct position
	elementsArray.forEach((element) => {
		const currentChildren = Array.from(listContainer.children);
		const index = Number(element.dataset.index);

		if (currentChildren.some((e) => Number(e.dataset.index) === index)) return;

		const nextElement = currentChildren.find((e) => Number(e.dataset.index) > index);
		listContainer.insertBefore(element, nextElement);
	});
}

function generateList() {
	const newItems = [];

	const filteredRoutes = fuzzySearch(searchInput.value, routes, ['name', 'description', 'author.name']);

	for (const route of filteredRoutes.filter((r) => filters.includes(r.compensation))) {
		const element = document.createElement('div');

		const authorComponent = route.author.url ? `<a class="author-url" href="${route.author.url}" target="_blank">${route.author.name}</a>` : route.author.name;
		element.innerHTML = `
        <img src="${route.image}" />
        <div class="item-header">
            <div>
                <h3>${route.name}</h3>
                <p class="author">created by ${authorComponent}</p>
            </div>
            <div><a class="btn" href="${route.url}" data-primary>${COMPENSATION_TEXTS[route.compensation]}</a></div>
        </div>
        <p>
            ${route.description}
        </p>
        ${route.downloadSize || route.installSize ? '<div style="margin-top: 0.5em;"></div>' : ''}
        ${route.downloadSize ? `<span class="size-badge">Download size: ${formatBytes(route.downloadSize)}</span>` : ''}
        ${route.installSize ? `<span class="size-badge">Install size: ${formatBytes(route.installSize)}</span>` : ''}
        `;

		element.classList.add('item');
		element.dataset.index = route.index;
		newItems.push(element);
	}

	updateContainer(newItems);
}

generateList();
