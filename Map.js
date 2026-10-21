// Initialize the map centered on the AOI area
const map = L.map('map').setView([-0.73, 36.45], 11);

// Add Esri World Imagery basemap (free, no API key required)
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

// Load and display the AOI GeoJSON
fetch('Data/AOI.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: {
                color: '#007bff',
                weight: 3,
                fillColor: '#007bff',
                fillOpacity: 0.2
            }
        }).addTo(map);
        
        // Fit the map to the AOI bounds
        const bounds = L.geoJSON(data).getBounds();
        map.fitBounds(bounds);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));
