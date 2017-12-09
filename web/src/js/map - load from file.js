L.mapbox.accessToken = 'pk.eyJ1IjoibW1hdHRoZXciLCJhIjoiWWdtUWNMayJ9.BxS10-N7uNlhqPwH0daIew';

  
  
  // MAP LAYERS

var map = L.mapbox.map('map', 'mmatthew.8d575f0d',{ zoomControl: false })
    .setView([47.373, 8.544], 13);
new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);

  
  
  // GEOJSON DATA

var fountainsURL = 'data/springwater.geojson';
	
var fountainLayer = L.mapbox.featureLayer()
	.loadURL(fountainsURL)
	.addTo(map);
	
		
var fountains = fountainLayer.getGeoJSON();
	
  // Add marker color, symbol, and size to fountain GeoJSON
  for(var i = 0; i < fountains.features.length; i++) {
    fountains.features[i].properties['marker-color'] = '#024B9C';
    fountains.features[i].properties['marker-symbol'] = 'beer';
    fountains.features[i].properties['marker-size'] = 'small';
  };
  
fountainLayer.setGeoJSON(fountains);

var nearestGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [8.544,47.373]
        },
        "properties": {
          "title": "Nearest fountain",
          "marker-symbol": "beer",
		  "marker-size": "large"
        }
      }
    ]};



//fountainLayer.addTo(map);

  
var marker = L.marker(new L.LatLng(47.373, 8.544), {
    icon: L.mapbox.marker.icon({
        "marker-color": "#000000",
        "title": "You need water",
        "marker-symbol": "pitch",
        "marker-size": "large"
    }),
    draggable: true,
    zIndexOffset:999
}).addTo(map);

// Nearest fountain marker
var nearestMarker = L.mapbox.featureLayer().addTo(map);

// Buffer around selected point
var bufferLayer = L.mapbox.featureLayer().addTo(map);
	
var currentPosition = marker.getLatLng();
var realPosition;
// var currentPosition = {
//	lat:47.373,
//	lng:8.544
//};
//$('#findme').show();

//geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    $('#findme').show();
    realPosition=[position.coords.latitude, position.coords.longitude];
}

//find me functionality
$('#findme').on('click', function(){
	marker.setLatLng(realPosition);
	map.setView(realPosition, 14);
	updateFountains();
});

//find path functionality
$('#routeme').on('click', function(){
	findPath();
});



//   Bind a popup to each feature in fountainLayer 
  fountainLayer.eachLayer(function (layer) {
    layer.bindPopup('<strong>' + layer.feature.properties.name + '</strong>', { closeButton: false });
  }).addTo(map);


  // Open popups on click
  fountainLayer.on('click', function (e) {
    moveNearest(e.layer.toGeoJSON())
	$('#routeme').show();
	
  });

// Reset marker
  function reset() {
    //var nearestFeature = nearestMarker.getGeoJSON();
    //nearestMarker.properties['marker-opacity'] = '0';
    //nearestMarker.setGeoJSON(nearestFeature);
	$('path').remove();
	//map.setView([currentPosition.lat,currentPosition.lng], 14)
  };
  

  
  // Circle buffer function
  function pointBuffer (pt, radius, units, resolution) {
  var ring = []
  var resMultiple = 360/resolution;
  for(var i  = 0; i < resolution; i++) {
    var spoke = turf.destination(pt, radius, i*resMultiple, units);
    ring.push(spoke.geometry.coordinates);
  }
  if((ring[0][0] !== ring[ring.length-1][0]) && (ring[0][1] != ring[ring.length-1][1])) {
    ring.push([ring[0][0], ring[0][1]]);
  }
  return turf.polygon([ring])
}


  // When the location is dragged, do the following
  marker.on('dragend', function(){
	  updateFountains();
  }); 
  
  function updateFountains(){
    // Reset any and all marker sizes to small
    //reset();
	$('path').remove();
	$('#routeme').show();
	$('.distance-icon').remove();
	
    // Get the GeoJSON from markerFeatures and fountainFeatures
    currentPosition = marker.getLatLng();
	var point = turf.point(currentPosition.lng,currentPosition.lat);
    var fountainFeatures = fountains //fountainLayer.getGeoJSON();
	
	//draw buffer
	//var buffer = pointBuffer(point, 0.2, 'miles',120);
	//buffer.properties = {
	//	"fill": "#00704A",
	//	"fill-opacity":0.1,
	//	"stroke": "#00704A",
	//	"stroke-width": 1,
	//	"stroke-opacity": 0.5
	//};
	//bufferLayer.setGeoJSON(buffer)

    // Using Turf, find the nearest fountain to location (GeoJSON returned)
    var nearestFountain = turf.nearest(point, fountainFeatures);
	
	
	//map.setView([currentPosition.lat,currentPosition.lng], 16);
	
    // get GeoJSON of nearest fountain to a  marker
    // nearestFeature = nearestFountain.getGeoJSON(); nearestfountain IS a GeoJSON!!!
	
    // Set the position of the nearest fountain marker
    moveNearest(nearestFountain);
	
  };
  
  function moveNearest(newLoc){
	  newLoc.properties = {
	    "marker-color": "#024B9C",
        "title": "You need water",
        "marker-symbol": "beer",
		"marker-size": "large",
		"marker-line-color": "#FFFFFF",
		"marker-line-width": 2,
		"marker-opacity":1,
		"name": newLoc.properties.name
	};
    nearestMarker.setGeoJSON(newLoc);
	
	nearestMarker.eachLayer(function(marker){
	marker.bindPopup('<strong>' + 	newLoc.properties.name + '</strong>', { closeButton: false });
	marker.openPopup();
	});
  }
  
  
  function findPath(){
	// assemble directions URL based on currentPosition of user and selected cafe
	
	var nearestFountain = nearestMarker.getGeoJSON();
	
	var fountain_pos = {
	lat : nearestFountain.geometry.coordinates[1],
	lng : nearestFountain.geometry.coordinates[0]};
	var startEnd= currentPosition.lng+','+currentPosition.lat+';'+fountain_pos.lng+','+fountain_pos.lat;
	var directionsAPI = 'https://api.tiles.mapbox.com/v4/directions/mapbox.walking/'+startEnd+'.json?access_token='+L.mapbox.accessToken;

	// query for directions and draw the path
	$.get(directionsAPI, function(data){
		var coords= data.routes[0].geometry.coordinates;
		coords.unshift([currentPosition.lng, currentPosition.lat]);
		coords.push([fountain_pos.lng, fountain_pos.lat]);
		var path = turf.linestring(coords, {
			"stroke": "#00704A",
			"stroke-width": 4,
			"opacity":1
		});

		$('.distance-icon').remove();
		map.fitBounds(map.featureLayer.setGeoJSON(path).getBounds());
		window.setTimeout(function(){$('path').css('stroke-dashoffset',0)},400);
		var duration= parseInt((data.routes[0].duration)/60);
		if (duration<100){
			L.marker([coords[parseInt(coords.length*0.5)][1],coords[parseInt(coords.length*0.5)][0]],{
				icon: L.divIcon({
					className: 'distance-icon',
					html: duration+'<span style="font-size:0.8em"> min</span>',
					iconSize: [45, 23]
				})})
			.addTo(map);
		}
	})
	
	$('#routeme').hide();
	};

  getLocation();
  
  // When the map is clicked 
  map.on('click', function (e) {
    var popup = L.popup({ closeButton: false })
	.setLatLng([e.latlng.lat, e.latlng.lng])
	.setContent('<a id="movehere" class="button">Set marker here.</a>')
	.openOn(map);
	
	$('#movehere').on('click', function(){
		currentPosition = [e.latlng.lat, e.latlng.lng]
		marker.setLatLng(currentPosition);
		map.setView(currentPosition);
		updateFountains();
	});
  });

  bufferLayer.on('click', function (e) {
    var popup = L.popup()
	.setLatLng([e.latlng.lat, e.latlng.lng])
	.setContent('<a id="movehere" class="button">Set marker here.</a>')
	.openOn(map);
	
	$('#movehere').on('click', function(){
		currentPosition = [e.latlng.lat, e.latlng.lng]
		marker.setLatLng(currentPosition);
		map.setView(currentPosition);
		updateFountains();
	});
  });
  
  // Disable scroll zoom when not at top of page
$( window ).scroll(function() {
	if ($(window).scrollTop() == 0){
		map.scrollWheelZoom.enable();
		map.dragging.enable();
	}else{
		map.scrollWheelZoom.disable();
		map.dragging.disable();
	}
});

// Show help on first visit
if (!localStorage['zurich_fountain_map']) {
   localStorage['zurich_fountain_map'] = 'yes';
}else{
	    $('#help').hide();
};

$('#close_help').on('click', function(){
	   $('#help').hide();
	});

