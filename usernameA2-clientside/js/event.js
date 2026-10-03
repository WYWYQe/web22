// js/event.js
// Event details page. The event id travels in the URL query string
// (event.html?id=3); we read it, call the API and render the result.

const urlParams      = new URLSearchParams(window.location.search);
const selectedId     = urlParams.get('id');

const detailStatusEl = document.getElementById('status');
const detailEl       = document.getElementById('event-detail');
const modalEl        = document.getElementById('register-modal');

function setDetailStatus(message, type) {
  detailStatusEl.textContent = message || '';
  detailStatusEl.className = 'status' + (type ? ' ' + type : '');
}

function fill(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value === null || value === undefined || value === '' ? '-' : value;
}

// Replaces everything inside a container with a single image.
function renderImage(container, imageUrl, hue) {
  container.style.setProperty('--hue', String(hue));
  container.innerHTML = '';
  if (!imageUrl) return;

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = '';
  // If the image file is missing, drop the broken <img> so the gradient shows.
  img.addEventListener('error', function () { img.remove(); });
  container.appendChild(img);
}

// Builds one <li>; when href is given the value is shown as a link.
function createContactItem(label, value, href) {
  const item = document.createElement('li');
  item.appendChild(document.createTextNode(label));

  if (href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = value;
    if (href.indexOf('http') === 0) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
    item.appendChild(link);
  } else {
    item.appendChild(document.createTextNode(value));
  }
  return item;
}

function renderEvent(event) {
  const isPast = event.event_status === 'past';

  // Header
  fill('d-name', event.event_name);
  fill('d-summary', event.summary);
  fill('d-category', event.category_name);

  const statusBadge = document.getElementById('d-status');
  statusBadge.textContent = isPast ? 'Past event' : 'Upcoming event';
  statusBadge.className = 'badge ' + (isPast ? 'badge-past' : 'badge-upcoming');

  // Artwork
  renderImage(document.getElementById('d-media'), event.image_url,
              categoryHue(event.category_id));

  // Body
  fill('d-description', event.description);
  fill('d-purpose', event.purpose);

  // Side panel
  fill('d-date', formatDate(event.event_date));
  fill('d-time', (formatTime(event.start_time) && formatTime(event.end_time))
                   ? formatTime(event.start_time) + ' - ' + formatTime(event.end_time)
                   : '');
  fill('d-venue', event.venue);
  fill('d-address', event.address);
  fill('d-city', event.city);
  fill('d-price', formatPrice(event.ticket_price));

  // Organiser
  fill('d-org', event.org_name);
  fill('d-org-mission', event.mission);

  const contactList = document.getElementById('d-org-contact');
  contactList.innerHTML = '';
  if (event.email) {
    contactList.appendChild(createContactItem('Email: ', event.email, 'mailto:' + event.email));
  }
  if (event.phone) {
    contactList.appendChild(createContactItem('Phone: ', event.phone, null));
  }
  if (event.website) {
    contactList.appendChild(createContactItem('Website: ', event.website, event.website));
  }

  // Goal vs progress
  const goal   = Number(event.goal_amount) || 0;
  const raised = Number(event.raised_amount) || 0;
  const wrap   = document.getElementById('d-progress-wrap');
  const noGoal = document.getElementById('d-no-goal');

  if (goal > 0) {
    const percent = (event.progress_percent !== null && event.progress_percent !== undefined)
      ? Number(event.progress_percent)
      : Math.round((raised / goal) * 1000) / 10;

    document.getElementById('d-progress-bar').style.width = Math.min(percent, 100) + '%';
    document.getElementById('d-progress-text').textContent =
      '$' + raised.toFixed(2) + ' raised of $' + goal.toFixed(2) + ' goal (' + percent + '%)';
    wrap.hidden = false;
    noGoal.hidden = true;
  } else {
    wrap.hidden = true;
    noGoal.hidden = false;
  }
}

// Load

async function loadEvent() {
  if (!selectedId) {
    setDetailStatus('No event was selected. Please open an event from the home page or the search page.', 'error');
    return;
  }

  try {
    const event = await getEventById(selectedId);
    renderEvent(event);
    detailEl.hidden = false;
    setDetailStatus('');
    document.title = event.event_name + ' | Charity Events';
  } catch (err) {
    setDetailStatus('This event could not be loaded: ' + err.message, 'error');
  }
}

// Register modal

function openModal() {
  modalEl.hidden = false;
  document.body.classList.add('modal-open');
  document.getElementById('modal-close').focus();
}
function closeModal() {
  modalEl.hidden = true;
  document.body.classList.remove('modal-open');
}

document.getElementById('register-btn').addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
modalEl.addEventListener('click', function (e) {
  if (e.target === modalEl) closeModal();      // click on the backdrop
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalEl.hidden) closeModal();
});

loadEvent();
