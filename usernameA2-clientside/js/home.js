// js/home.js
// Home page: loads the event lists from the API and renders them.

const homeStatusEl   = document.getElementById('status');
const upcomingListEl = document.getElementById('upcoming-list');
const pastListEl     = document.getElementById('past-list');
const pastHeadEl     = document.getElementById('past-head');

function setHomeStatus(message, type) {
  homeStatusEl.textContent = message || '';
  homeStatusEl.className = 'status' + (type ? ' ' + type : '');
}

// Replaces everything inside a container with one card per event.
function renderCards(container, events) {
  container.innerHTML = '';                 // clear the container
  events.forEach(function (event) {         // build and append each card
    container.appendChild(createEventCard(event));
  });
}

async function loadHomeEvents() {
  try {
    // Two independent API calls started together and awaited together.
    const [upcoming, past] = await Promise.all([
      getEvents({ status: 'upcoming' }),
      getEvents({ status: 'past' })
    ]);

    // Upcoming events
    if (upcoming.count === 0) {
      setHomeStatus('There are no upcoming events at the moment. Please check back soon.', 'error');
    } else {
      renderCards(upcomingListEl, upcoming.events);
      setHomeStatus(upcoming.count + ' upcoming event' + (upcoming.count === 1 ? '' : 's') +
                    ' found. Pick one to see the full details.', 'success');
    }

    // Past events, only shown when there are any
    if (past.count > 0) {
      renderCards(pastListEl, past.events.slice().reverse());   // most recent first
      pastListEl.hidden = false;
      pastHeadEl.hidden = false;
    }
  } catch (err) {
    setHomeStatus('Sorry, the events could not be loaded: ' + err.message +
                  ' - please make sure the API server is running on port 3000.', 'error');
  }
}

loadHomeEvents();
