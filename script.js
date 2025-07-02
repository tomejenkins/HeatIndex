document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = 'YOUR_API_KEY_HERE'; // ← Replace with your actual key

  const zipInput = document.getElementById('zip-input');
  const updateBtn = document.getElementById('update-btn');
  const heatEl = document.getElementById('heat-index');
  const tempEl = document.getElementById('temperature');
  const humidityEl = document.getElementById('humidity');
  const errorEl = document.getElementById('error');

  function calculateHeatIndex(T, R) {
    return -42.379 + 2.04901523 * T + 10.14333127 * R
      - 0.22475541 * T * R - 0.00683783 * T * T
      - 0.05481717 * R * R + 0.00122874 * T * T * R
      + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
  }

  async function fetchWeather(zip) {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${API_KEY}`);
      if (!res.ok) throw new Error('ZIP code not found');

      const data = await res.json();
      const temp = data.main.temp;
      const humidity = data.main.humidity;
      const heatIndex = calculateHeatIndex(temp, humidity);

      tempEl.textContent = `${temp.toFixed(1)}°F`;
      humidityEl.textContent = `${humidity}%`;
      heatEl.textContent = `${heatIndex.toFixed(1)}°F`;
      errorEl.textContent = '';
    } catch (err) {
      errorEl.textContent = err.message;
      tempEl.textContent = '--°F';
      humidityEl.textContent = '--%';
      heatEl.textContent = '--°F';
    }
  }

  function updateWeather() {
    const zip = zipInput.value.trim();
    if (/^\d{5}$/.test(zip)) {
      fetchWeather(zip);
    } else {
      errorEl.textContent = 'Please enter a valid 5-digit ZIP code.';
    }
  }

  updateBtn.addEventListener('click', updateWeather);
  zipInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') updateWeather();
  });

  // Load default on first visit
  fetchWeather('75061');
});
