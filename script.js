// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. LEAFLET MAP INITIALIZATION ---
    
    // Initialize the map and set its view to a central location in India
    const map = L.map('map-container').setView([28.6139, 77.2090], 10);

    // Add a tile layer to the map (the visual map background)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Mock data for the wells
   const wellData = [
    { id: 'GW-001', lat: 28.6139, lng: 77.2090, level: '45.2m', quality: '210 ppm', status: 'Stable', color: '#23a971' },
    { id: 'GW-002', lat: 28.6300, lng: 77.2200, level: '51.5m', quality: '350 ppm', status: 'Alert', color: '#f5a623' },
    { id: 'GW-003', lat: 28.5900, lng: 77.1800, level: '62.0m', quality: '480 ppm', status: 'Critical', color: '#e14a4a' }
    ];

    const dataDisplay = document.getElementById('data-display');

    // Add markers to the map for each well
    wellData.forEach(well => {
        const marker = L.marker([well.lat, well.lng]).addTo(map);
        
        // When a marker is clicked, update the data display panel
        marker.on('click', function() {
            dataDisplay.innerHTML = `
                <h3>Well ID: ${well.id}</h3>
                <div class="data-card">
                    <h4>💧 Water Level</h4>
                    <p>${well.level}</p>
                </div>
                <div class="data-card">
                    <h4>🔬 Water Quality (TDS)</h4>
                    <p>${well.quality}</p>
                </div>
                <div class="data-card">
                    <h4>📊 Status</h4>
                    <p style="color:${well.color}; font-weight: bold;">${well.status}</p>
                </div>
            `;
        });
    });
    
    // Some basic styling for the new data cards
    const style = document.createElement('style');
    style.innerHTML = `
        .data-card {
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        .data-card h4 {
            color: var(--secondary-text);
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
        }
        .data-card p {
            font-size: 1.5rem;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);


    // --- 2. CHART.JS SIMULATION ---
    
    const forecastBtn = document.getElementById('forecast-btn');
    const predictionResultDiv = document.getElementById('prediction-result');
    let predictionChart; // Variable to hold the chart instance

    forecastBtn.addEventListener('click', function() {
        // Sample data for the forecast chart
        const forecastData = {
            labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [{
                label: 'Predicted Water Level (meters)',
                data: [48, 49, 51, 54, 58, 62], // Shows a declining trend (deeper level)
                borderColor: 'var(--accent-color)',
                backgroundColor: 'rgba(0, 113, 227, 0.1)',
                fill: true,
                tension: 0.4 // Makes the line smooth
            }]
        };

        // Clear previous results and create a canvas for the new chart
        predictionResultDiv.innerHTML = '<canvas id="predictionChart"></canvas>';
        const ctx = document.getElementById('predictionChart').getContext('2d');
        
        // Create the chart
        predictionChart = new Chart(ctx, {
            type: 'line',
            data: forecastData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Depth in Meters'
                        }
                    }
                }
            }
        });
    });

});

// --- 3. SCROLL FADE-IN ANIMATION ---

// Get all the sections we want to animate
const sections = document.querySelectorAll('main section');

// Set up the Intersection Observer
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1 // Trigger when 10% of the section is visible
});

// Add the 'hidden' class to each section initially and tell the observer to watch it
sections.forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});