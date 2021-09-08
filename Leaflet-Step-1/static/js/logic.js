var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// Create the map object with options
var map = L.map("mapid", {
  center: [40.73, -74.0059],
  zoom: 3,
  layers: [graymap, satellitemap, outdoors]
});
graymap.addTo(map)

var earthquakes = new L.LayerGroup();
var tectonicplates = new L.LayerGroup();
// Create a baseMaps object to hold the lightmap layer
var baseMaps = {
  "graymap": graymap,
  "satellitemap": satellitemap,
  "outdoors": outdoors 
};

// Create an overlayMaps object to hold the bikeStations layer
var overlayMaps = {
  "earthquakes": earthquakes,
  "tectonicplates": tectonicplates
};



// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(map);


// Our AJAX call retrieves our earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {



  function circlestyle(feature){
    return {
    radius: circleradius(feature.properties.mag),
    fillColor: getColor(feature.geometry.coordinates[2]),
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
    };
  }

  function circleradius(magnitude){
    if(magnitude==0){
      return 1;
    }
    return magnitude*4;
  }

  function getColor(depth) {
    return depth> 90 ? '#800026' :
           depth> 70  ? '#BD0026' :
           depth> 50  ? '#E31A1C' :
           depth> 30  ? '#FC4E2A' :
           depth> 10   ? '#FED976' :
                      '#FFEDA0';
}

L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
    style:circlestyle

}).addTo(earthquakes);
earthquakes.addTo (map);
});


//   // Here we make an AJAX call to get our Tectonic Plate geoJSON data.
//  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
//     function(platedata) {
