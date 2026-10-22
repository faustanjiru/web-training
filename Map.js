// Initialize the map centered on the AOI area
const map = L.map('map').setView([-0.73, 36.45], 11);

// Add Esri World Imagery basemap (free, no API key required)
const esriImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

// Add OpenStreetMap basemap as alternative
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create basemaps object
const basemaps = {
    "Satellite (Esri)": esriImagery,
    "Street Map (OSM)": osm
};

// Create overlay layers object
const overlays = {};

// Load and display the AOI GeoJSON
fetch('Data/AOI.geojson')
    .then(response => response.json())
    .then(data => {
        const aoiLayer = L.geoJSON(data, {
            style: {
                color: '#007bff',
                weight: 3,
                fillColor: '#007bff',
                fillOpacity: 0.2
            }
        }).addTo(map);
        
        // Add AOI layer to overlays
        overlays["AOI"] = aoiLayer;
        
        // Add layer control
        L.control.layers(basemaps, overlays).addTo(map);
        
        // Fit the map to the AOI bounds
        const bounds = aoiLayer.getBounds();
        map.fitBounds(bounds);
    })
    .catch(error => console.error('Error loading AOI GeoJSON:', error));

// Load and display the Marks GeoJSON
fetch('Data/Marks.geojson')
    .then(response => response.json())
    .then(data => {
        const marksLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: '#ff6b6b',
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    const popupContent = `
                        <strong>Station:</strong> ${feature.properties.Station}<br>
                        <strong>No:</strong> ${feature.properties.No_}<br>
                        <strong>H:</strong> ${feature.properties.H}m
                    `;
                    layer.bindPopup(popupContent);
                }
            }
        }).addTo(map);
        
        // Add Marks layer to overlays
        overlays["Marks"] = marksLayer;
        
        // Update layer control
        L.control.layers(basemaps, overlays).addTo(map);
    })
    .catch(error => console.error('Error loading Marks GeoJSON:', error));
