function initMap() {
	var heatmap_url = '<%=j@image_path %>';

	var map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 11,
		minZoom: 11,
    	center: {lat: 1.31505, lng: 103.8448}
  	});

  	var bounds = {
	    north: 1.4793,
	    south: 1.1508,
	    east: 104.1375,
	    west: 103.5521
    };

  	var historicalOverlay = new google.maps.GroundOverlay(heatmap_url,
  		bounds,
  		{
  			opacity: 1
  		});
  	historicalOverlay.setMap(map);

  	/*
  	var ne = new google.maps.Marker({
  		map: map,
  		position: {lat: 1.4793, lng: 104.1375},
  		draggable: true
  	})

  	var sw = new google.maps.Marker({
  		map: map,
  		position: {lat: 1.1508, lng: 103.5521},
  		draggable: true
  	})
  	*/
}