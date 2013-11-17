function PartyMapCtrl($scope, $timeout) {

	// Start centering on the USA
	var ll = new google.maps.LatLng(37.09024, -95.7128910);

	// Party map options
    $scope.mapOptions = {
        center: ll,
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.TOP_CENTER
		}
    };

    // If we can use their browser's location, center to there
    if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$scope.partyMap.setCenter(initialLocation);
			$scope.partyMap.setZoom(11);
		});
	}

}