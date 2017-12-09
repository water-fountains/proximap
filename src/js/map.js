L.mapbox.accessToken = 'pk.eyJ1IjoibW1hdHRoZXciLCJhIjoiWWdtUWNMayJ9.BxS10-N7uNlhqPwH0daIew';

  
  // GEOJSON DATA
    
	var fountainsURL = 'brunnen.json';
	


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
			"marker-size": "large",
			"marker-color": "#DAD122",
			"marker-line-color": "#FFF",
			"marker-line-width": 2,
			"marker-opacity":1
        }
      }
    ]};

  
  // MAP LAYERS

var map = L.mapbox.map('map', 'mmatthew.8d575f0d',{ zoomControl: false })
    .setView([47.373, 8.544], 15);
new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);


var fountainLayer = L.mapbox.featureLayer()
  .addTo(map);

$.ajax({
  url: fountainsURL,
  datatype: 'jsonp',
  success: function(data){
	

	data.features.forEach(function(fountain){
    if(fountain.properties.wasserart_txt == "Quellwasser"){
      fountain.properties['marker-color'] = '#024B9C';
    } else {
      fountain.properties['marker-color'] = '#67A0DF';
    }
		fountain.properties['marker-symbol'] = 'beer';
		fountain.properties['marker-size'] = 'small';
	}); 
	  
	fountainLayer.setGeoJSON(data)
  }
});


// Nearest fountain marker  

var marker = L.marker(new L.LatLng(47.373, 8.544), {
    icon: L.icon({
            "iconUrl": "images/walking-icon.png",
            "iconSize": [36,102], // size of the icon
            "iconAnchor": [18, 45], // point of the icon which will correspond to marker's location
            "popupAnchor": [0, -16], // point from which the popup should open relative to the iconAnchor
    }),
    draggable: true,
    zIndexOffset:999
}).addTo(map);

var nearestMarker = L.mapbox.featureLayer(nearestGeoJSON).addTo(map);
 
var popup;

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
	map.setView(realPosition);
	updateFountains();
});

//find path functionality
$('#routeme').on('click', function(){
	findPath();
});


/*
//   Bind a popup to each feature in fountainLayer 
  fountainLayer.eachLayer(function (layer) {
    layer.bindPopup('<strong>' + layer.feature.properties.name + '</strong>', { closeButton: false });
  }).addTo(map);
*/

  // On fountain click: move nearest marker and show popup
  fountainLayer.on('click', function (e) {
    moveNearest(e.layer.toGeoJSON())
	$('#routeme').show();
	
	nearestMarker.eachLayer(function(marker){
		marker.bindPopup('<strong>' + 	marker.feature.properties.brunnenart_txt 
      + '</strong><br/>' + (marker.feature.properties.bezeichnung?(marker.feature.properties.bezeichnung+'<br/>'):'')
      + marker.feature.properties.wasserart_txt
      + (marker.feature.properties.historisches_baujahr?('<br/>historisches Baujahr:'+marker.feature.properties.historisches_baujahr):''), { closeButton: true });
		marker.openPopup();
	});
	
  });
  
//  nearestMarker.on('click', function (e) {
//	nearestMarker.eachLayer(function(marker){
//		marker.bindPopup('<strong>' + 	e.properties.name + '</strong>', { closeButton: true });
//		marker.openPopup();
//	});	
//  });

// Reset marker
  function reset() {
    //var nearestFeature = nearestMarker.getGeoJSON();
    //nearestMarker.properties['marker-opacity'] = '0';
    //nearestMarker.setGeoJSON(nearestFeature);
	$('path').remove();
	//map.setView([currentPosition.lat,currentPosition.lng], 14)
  };
  

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
    var fountainFeatures = fountainLayer.getGeoJSON();
	
	// Find nearest fountain
    var nearestFountain = turf.nearest(point, fountainFeatures);
	
	
	//map.setView([currentPosition.lat,currentPosition.lng], 16);
	
    // get GeoJSON of nearest fountain to a  marker
    // nearestFeature = nearestFountain.getGeoJSON(); nearestfountain IS a GeoJSON!!!
	
    // Set the position of the nearest fountain marker
    moveNearest(nearestFountain);
	
	// Open popup
	
	
  };
  
  function moveNearest(newLoc){
	  var tempJSON = nearestGeoJSON;
	  tempJSON.features[0].properties=newLoc.properties;
	  // tempJSON.features[0].properties['Standort']=newLoc.properties.Standort;
	  tempJSON.features[0].properties['title']=newLoc.properties.brunnenart_txt;
	  //tempJSON.features[0].properties['marker-color']=newLoc.properties['marker-color'];
	  tempJSON.features[0].geometry.coordinates=newLoc.geometry.coordinates;
    nearestMarker.setGeoJSON(tempJSON);
	nearestMarker.eachLayer(function(marker){
		marker.bindPopup('<strong>' + 	marker.feature.properties.Standort + '</strong><br/>'+marker.feature.properties.wasserart_txt, { closeButton: true });
		//marker.openPopup();
	});
  };
  
  
  function findPath(){
	// assemble directions URL based on currentPosition of user and selected cafe
	
	var nearestFountain = nearestMarker.getGeoJSON();
	
	var fountain_pos = {
	lat : nearestFountain.features[0].geometry.coordinates[1],
	lng : nearestFountain.features[0].geometry.coordinates[0]};
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
    popup = L.popup({ closeButton: false, className: 'move-here'})
	.setLatLng([e.latlng.lat, e.latlng.lng])
	.setContent('<a id="movehere" class="button">Set marker here.</a>')
	.openOn(map);
	
	$('#movehere').on('click', function(){
		currentPosition = [e.latlng.lat, e.latlng.lng]
		marker.setLatLng(currentPosition);
		map.setView(currentPosition);
		updateFountains();
		//popup=map.getElementByClass('move-here');
		$('.move-here').hide();
		//popup = 0;
	});
  });
  
  // Disable scroll zoom when not at top of page
$( window ).scroll(function() {
	if ($(window).scrollTop() == 0){
		$('#map-mask').hide();
		// $('#map2-link').addClass('active')
	}else{
		$('#map-mask').show();
	}
});

// Show help on first visit
if (!localStorage['zurich_fountain_map']) {
   localStorage['zurich_fountain_map'] = 'yes';
	    $('#help').show();
}else{
	    $('#help').hide();
};

$('#close_help').on('click', function(){
	   $('#help').hide();
	});

