// Store API link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(mag) {
  return mag * 20000;
}

function markerColor(mag) {
  switch (true) {
    case mag > 5:
      return "darkred";
    case mag > 4:
      return "orangered";
    case mag > 3:
      return "orange";
    case mag > 2:
      return "yellow";
    case mag > 1:
      return "yellowgreen";
    default:
      return "mediumseagreen";
    }

}

// Perform a GET request to the query URL
d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
    onEachFeature : function (feature, layer) {

      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
      },     pointToLayer: function (feature, latlng) {
        return new L.circle(latlng,
          {radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          fillOpacity: 0.75,
          stroke: true,
          weight: 0.5,
          color: "black",
          opacity: 1
      })
    }
  });
    


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: "pk.eyJ1IjoiamFuZWphbmVqYW0iLCJhIjoiY2tkNm9rY3NnMXJ0bTM2bnUzaW8yODNwdSJ9.yQEqW9XLF67VMyl2VmMm1A"
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: "pk.eyJ1IjoiamFuZWphbmVqYW0iLCJhIjoiY2tkNm9rY3NnMXJ0bTM2bnUzaW8yODNwdSJ9.yQEqW9XLF67VMyl2VmMm1A"
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create map object
  var myMap = L.map("map", {
    center: [37.0522, -118.2437],
    zoom: 5, 
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      labels = ['<strong>Magnitude</strong><br>']    
      magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
          labels.push(
              '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> &nbsp;&nbsp;' + 
        + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] : ' + '));
        }
        div.innerHTML = labels.join('<br>');
      return div;
  };
  
  legend.addTo(myMap);

}