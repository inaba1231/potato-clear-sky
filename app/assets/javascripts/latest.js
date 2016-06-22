function initMap() {

  // Create base map.
	var map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 11,
		  minZoom: 11,
    	center: {lat: 1.31505, lng: 103.8448},
      draggable: false,
      scrollwheel: false,
      mapTypeControl: false,
      streetViewControl: false,
      panControl: true
  });

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
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }
  }
  
  // URL for latest heatmap.
  var heatmap_url = $("#map").data("heatmap");

  // Singapore's bounds.
	var bounds = {
    north: 1.4793,
    south: 1.1508,
    east: 104.1375,
    west: 103.5521
  };

  // Overlay heatmap with base map.
	var Overlay = new google.maps.GroundOverlay(heatmap_url,
		bounds,
		{
			opacity: 1
		});

	Overlay.setMap(map);

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