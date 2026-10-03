// js/search.js
// Search page: builds the filter controls from the API, sends the
// selected criteria to GET /api/events and renders the results.

const filterForm     = document.getElementById('filter-form');
const dateFromInput  = document.getElementById('filter-date-from');
const dateToInput    = document.getElementById('filter-date-to');
const citySelect     = document.getElementById('filter-city');
const categorySelect = document.getElementById('filter-category');
const clearButton    = document.getElementById('clear-filters');
const searchStatusEl = document.getElementById('status');
const resultsEl      = document.getElementById('results');

function setSearchStatus(message, type) {
  searchStatusEl.textContent = message || '';
  searchStatusEl.className = 'status' + (type ? ' ' + type : '');
}

function addOption(select, value, label) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  select.appendChild(option);
}

// Replaces everything inside the results container with one card per event.
function renderResults(events) {
  resultsEl.innerHTML = '';                 // clear the container
  events.forEach(function (event) {         // build and append each card
    resultsEl.appendChild(createEventCard(event));
  });
}

// Populate the two dropdowns from the API
async function loadFilterOptions() {
  try {
    const [locations, categories] = await Promise.all([getLocations(), getCategories()]);

    locations.locations.forEach(function (city) {
      addOption(citySelect, city, city);
    });

    categories.categories.forEach(function (category) {
      addOption(categorySelect, category.category_id,
                category.category_name + ' (' + category.event_count + ')');
    });

    applyFiltersFromUrl();     // support links such as search.html?categoryId=1
  } catch (err) {
    setSearchStatus('The filter options could not be loaded: ' + err.message, 'error');
  }
}

// Run a search
async function runSearch(filters) {
  setSearchStatus('Searching...');
  resultsEl.innerHTML = '';

  try {
    const data = await getEvents(filters);

    if (data.count === 0) {
      setSearchStatus('No events match your filters. Try removing one of the criteria.', 'error');
      return;
    }

    renderResults(data.events);
    setSearchStatus(data.count + ' event' + (data.count === 1 ? '' : 's') + ' found.', 'success');
  } catch (err) {
    setSearchStatus('The search could not be completed: ' + err.message, 'error');
  }
}

function currentFilters() {
  return {
    dateFrom:   dateFromInput.value,
    dateTo:     dateToInput.value,
    city:       citySelect.value,
    categoryId: categorySelect.value
  };
}

// The date inputs hold 'YYYY-MM-DD', so a plain string comparison orders them.
function dateRangeIsValid(filters) {
  return !(filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo);
}

function applyFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const fields = {
    dateFrom:   dateFromInput,
    dateTo:     dateToInput,
    city:       citySelect,
    categoryId: categorySelect
  };
  let used = false;

  Object.keys(fields).forEach(function (key) {
    if (params.has(key)) {
      fields[key].value = params.get(key);
      used = true;
    }
  });

  if (used) runSearch(currentFilters());
}

// Form events

filterForm.addEventListener('submit', function (event) {
  event.preventDefault();                 // stay on the page, call the API instead
  const filters = currentFilters();

  // An empty form is valid: it lists every active event.
  if (!dateRangeIsValid(filters)) {
    setSearchStatus('"Date from" must not be later than "Date to".', 'error');
    return;
  }

  runSearch(filters);
});

// "Clear Filters" resets every form control.
clearButton.addEventListener('click', function () {
  filterForm.reset();                     // clears the date inputs
  dateFromInput.value = '';               // reset() does not reliably restore
  dateToInput.value = '';                 // the selected option, so set them too
  citySelect.value = '';
  categorySelect.value = '';
  resultsEl.innerHTML = '';
  setSearchStatus('Filters cleared. Choose any combination and press Search.');
});

loadFilterOptions();
