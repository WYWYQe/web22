// js/api.js
// Small wrapper around the RESTful API.
// fetch() returns a Promise; async/await unwraps it and
// try/catch turns a failed request into a readable Error.

const API_BASE = 'http://localhost:3000/api';

/**
 * GET a path from the API and return the parsed JSON body.
 * Throws an Error carrying the API's own error message when the
 * response status is not 2xx (for example 400 or 404).
 */
async function apiGet(path) {
  const response = await fetch(API_BASE + path);

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    data = null;                                   // body was not JSON
  }

  if (!response.ok) {
    const message = (data && data.error)
      ? data.error
      : 'Request failed (HTTP ' + response.status + ')';
    throw new Error(message);
  }
  return data;
}

// Endpoint helpers

function getEvents(filters) {
  const query = new URLSearchParams();
  Object.keys(filters || {}).forEach(function (key) {
    const value = filters[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      query.append(key, value);
    }
  });
  const qs = query.toString();
  return apiGet('/events' + (qs ? '?' + qs : ''));
}

function getEventById(id) {
  return apiGet('/events/' + encodeURIComponent(id));
}

function getCategories() {
  return apiGet('/categories');
}

function getLocations() {
  return apiGet('/locations');
}

// Shared display helpers

function formatDate(isoDate) {
  if (!isoDate) return '';
  // append a time so the date is parsed in local time, not UTC
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
}

function formatTime(time) {
  if (!time) return '';
  return String(time).slice(0, 5);           // '07:30:00' -> '07:30'
}

function formatPrice(price) {
  const value = Number(price);
  if (!value) return 'Free entry';
  return '$' + value.toFixed(2);
}

/** A stable colour per category, used behind the card artwork. */
function categoryHue(categoryId) {
  return (Number(categoryId) * 47) % 360;
}

/**
 * Builds one event card as DOM nodes and returns it.
 * The home page and the search page both use this, so their cards match.
 */
function createEventCard(event) {
  const isPast = event.event_status === 'past';

  const card = document.createElement('article');
  card.className = 'event-card';

  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = 'event.html?id=' + encodeURIComponent(event.event_id);

  const media = document.createElement('div');
  media.className = 'card-media';
  media.style.setProperty('--hue', String(categoryHue(event.category_id)));

  if (event.image_url) {
    const img = document.createElement('img');
    img.src = event.image_url;
    img.alt = '';
    img.loading = 'lazy';
    // If the image file is missing, drop the broken <img> so the
    // gradient underneath shows instead.
    img.addEventListener('error', function () { img.remove(); });
    media.appendChild(img);
  }

  const category = document.createElement('span');
  category.className = 'card-cat';
  category.textContent = event.category_name;
  media.appendChild(category);

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = event.event_name;

  const summary = document.createElement('p');
  summary.className = 'card-summary';
  summary.textContent = event.summary;

  const meta = document.createElement('ul');
  meta.className = 'card-meta';
  [
    '\uD83D\uDCC5 ' + formatDate(event.event_date),
    '\uD83D\uDCCD ' + event.city,
    '\uD83C\uDF9F ' + formatPrice(event.ticket_price)
  ].forEach(function (value) {
    const item = document.createElement('li');
    item.textContent = value;
    meta.appendChild(item);
  });

  const badge = document.createElement('span');
  badge.className = 'badge ' + (isPast ? 'badge-past' : 'badge-upcoming');
  badge.textContent = isPast ? 'Past event' : 'Upcoming';

  body.appendChild(title);
  body.appendChild(summary);
  body.appendChild(meta);
  body.appendChild(badge);

  link.appendChild(media);
  link.appendChild(body);
  card.appendChild(link);

  return card;
}
