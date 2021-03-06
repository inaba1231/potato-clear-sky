function initMap() {

  // Create base map.
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		minZoom: 11,
		center: {lat: 1.31505, lng: 103.8448},
		mapTypeControl: false,
		streetViewControl: false,
  });

  // URL for latest heatmap.
  var heatmap_url = $("#map").data("heatmap");

  // Singapore's bounds.
	var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(1.1506365254950617, 103.55194569091805),
    new google.maps.LatLng(1.4794526447362755, 104.13765430908211)
  );

  // Heatmap display toggles and click listener.
  var overlay = null;
  var heatmap_toggle = document.getElementById('heatmap_toggle');

  function opacity(is_checked) {
	if (is_checked) return 1;
  	else return 0.5;
  }

	heatmap_toggle.addEventListener('click', function() {
		if(!overlay) return;
		else overlay.setOpacity(opacity(heatmap_toggle.checked));;
	});

  // Overlay heatmap with base map.
	overlay = new google.maps.GroundOverlay(heatmap_url,
		bounds,
		{opacity: opacity(heatmap_toggle.checked)}
	);

	overlay.setMap(map);

  // Create direction service and direction display.
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('direction_result'));

  // HTML input elements.
  var origin_input = document.getElementById('origin-input');
  var destination_input = document.getElementById('destination-input');
  var modes = document.getElementById('mode-selector');

  // Create autocomplete text inputs and bind reccomendations to current viewport.
  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map);

  // Sets a listener on a radio button to change the travel mode.
  var travel_mode = google.maps.TravelMode.WALKING;
  var origin_place_id = null;
  var destination_place_id = null;

  function setupClickListener(id, mode) {
    var radioButton = document.getElementById(id);
    radioButton.addEventListener('click', function() {
      travel_mode = mode;
      route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay);
    });
  }

  setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
  setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
  setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

  // Sets a listener to expand viewport and generate route when origin input is filled.  
  origin_autocomplete.addListener('place_changed', function() {
    var place = origin_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    } else {
      expandViewportToFitPlace(map, place);
      origin_place_id = place.place_id;
      route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay);
    }
  });

  // Sets a listener to expand viewport and generate route when destination input is filled.
  destination_autocomplete.addListener('place_changed', function() {
    var place = destination_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    } else {
      expandViewportToFitPlace(map, place);
      destination_place_id = place.place_id;
      route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay);
    }
  });

  // Expands viewport to fit the place origin or destination.
  function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }

  // Route display toggle and click listener.
  var route_toggle = document.getElementById('route_toggle');

	route_toggle.addEventListener('click', function() {
		directionsDisplay.setOptions({
			suppressPolylines: !route_toggle.checked
		});
		directionsDisplay.setMap(map);
	});

  // Generates route from origin to destination in the selected travel mode.
  function route(origin_place_id, destination_place_id, travel_mode,
                 directionsService, directionsDisplay) {
    if (!origin_place_id || !destination_place_id) {
      return;
    } else {
      directionsService.route({
        origin: {'placeId': origin_place_id},
        destination: {'placeId': destination_place_id},
        travelMode: travel_mode,
        provideRouteAlternatives: true
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
        	directionsDisplay.setOptions({
        		draggable: true,
						suppressPolylines: !route_toggle.checked
					});
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }
  }

  // Create an array to keep track of last valid center at each zoom level.
  var last_center = new Array(11);
  for(var i = 0; i < 11; i++) last_center[i] = map.getCenter();

  // Keeps track of last valid center to return to when the bounds are exceeded.
  google.maps.event.addListener(map,
    'bounds_changed',
    function() {
      	var current_bound = map.getBounds();
      	var ne = current_bound.getNorthEast();
      	var sw = current_bound.getSouthWest();
      	var nw = new google.maps.LatLng(ne.lat(), sw.lng());
      	var se = new google.maps.LatLng(sw.lat(), ne.lng());

      	if(bounds.contains(ne) && bounds.contains(sw)
           && bounds.contains(nw) && bounds.contains(se)) last_center[map.getZoom() - 1] = map.getCenter();
      	else map.setCenter(last_center[map.getZoom() - 1]);
    }
  );

  var infoWindow = new google.maps.InfoWindow();

/*
  function handleLocationError(browserHasGeolocation, info_window, pos) {
	  info_window.setPosition(pos);
	  info_window.setContent(browserHasGeolocation ?
	                    "Error: The Geolocation service failed." :
	                    "Error: Your browser doesn't support geolocation.");
	}
*/


  // Try HTML5 geolocation.
  if (navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.open(map);
      infoWindow.setPosition(pos);
      infoWindow.setContent("Your current location.");
    }, function(error) {
    	alert(error.message);
    });
  } else {
  	alert("Your browser doesn't support geolocation.");
  }

	/*
	var northeast = new google.maps.Marker({
		map: map,
		position: {lat: 1.4793, lng: 104.1375},
		draggable: true
	})

	var southewest = new google.maps.Marker({
		map: map,
		position: {lat: 1.1508, lng: 103.5521},
		draggable: true
	})
	*/
}