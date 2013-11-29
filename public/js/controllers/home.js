function HomeCtrl($scope, $http, $timeout, geocoder) {

	$scope.create_form = {location: {}};
	$scope.search_form = {location: {}};
	$scope.errors = {};
	$scope.locationPlaceholder = "Location";
	$scope.today = new Date();

	var markerCluster;
	var markerSpider;
	var infoWindow;

	$scope.createParty = function() {

		if (!$scope.create_form.name || !$scope.create_form.location || !$scope.create_form.raw_date) {
			$scope.validateCreateForm = true;
			return;
		} else {
			$scope.validateCreateForm = false;
		}

		var startDate;
		var endDate;
		var allDay = false;

		if ($scope.create_form.from && $scope.create_form.to) {

			// Make the start date
			var hoursAndMinutes = $scope.create_form.from.split(":");
			startDate = new Date($scope.create_form.raw_date.getTime());
			startDate.addHours(hoursAndMinutes[0]);
			startDate.addMinutes(hoursAndMinutes[1]);


			// Make the end date
			hoursAndMinutes = $scope.create_form.to.split(":");
			endDate = new Date($scope.create_form.raw_date.getTime());
			endDate.addHours(hoursAndMinutes[0]);
			endDate.addMinutes(hoursAndMinutes[1]);

		} else {

			startDate = new Date($scope.create_form.raw_date);
			endDate = new Date($scope.create_form.raw_date);
			endDate.addHours(23);
			endDate.addMinutes(59);
			allDay = true;

		}

		$scope.create_form.date_time = {start_date: startDate, end_date: endDate, all_day: allDay};

		$http.post('/api/createParty', {party: $scope.create_form}).success(function(data){
			if (data.success) {
				$scope.modalView = "";
				$scope.create_form = {location: {}};
				alertify.success("Event created");
			}
		});
	}

	// This forces the user to chose a time after the from time
	$scope.changeFromTime = function() {
		var chosenIdx = 0;

		for (var i = 0; i < toOriginalOptions.length; i++) {
			if ($scope.create_form.from == toOriginalOptions[i].key) {
				chosenIdx = i;
				break;
			}
		};

		chosenIdx += 1;

		$scope.create_form.to = undefined;
		$scope.toOptions = toOriginalOptions.slice().splice(chosenIdx, toOriginalOptions.length - chosenIdx);
	}

	$scope.searchParty = function() {

		if (!$scope.search_form.location.address || !$scope.search_form.distance || !$scope.search_form.start_date || !$scope.search_form.end_date) {
			$scope.validateSearchForm = true;
			$scope.searchErrorMsg = "Fill in a location, date range, and distance.";
			return;
		} else {
			$scope.validateSearchForm = false;
		}

		$scope.gettingEvents = true;
		$scope.modalView = "";

		// Make the start date
		if ($scope.search_form.to) {
			var hoursAndMinutes = $scope.search_form.from.split(":");
			$scope.search_form.start_date.clearTime();
			$scope.search_form.start_date.addHours(hoursAndMinutes[0]);
			$scope.search_form.start_date.addMinutes(hoursAndMinutes[1]);
		}

		// Make the end date
		if ($scope.search_form.from) {
			hoursAndMinutes = $scope.search_form.to.split(":");
			$scope.search_form.end_date.clearTime();
			$scope.search_form.end_date.addHours(hoursAndMinutes[0]);
			$scope.search_form.end_date.addMinutes(hoursAndMinutes[1]);	
		}

		// Make sure the end date is after the start date
		if ($scope.search_form.start_date.isAfter($scope.search_form.end_date)) {
			$scope.validateSearchForm = true;
			$scope.searchErrorMsg = "Start date needs to be before end date";
			return;
		} else {
			$scope.validateSearchForm = false;
		}

		// Initiate needed map elements
		$scope.initiateMapElements();
		infoWindow.close();

		// Go get the events from the server
		$http.post('/api/searchParty', {search: $scope.search_form}).success(function(data){
			
			if(data.success) {

				$scope.getApiEvents(function(events) {

					data.parties = data.parties.concat(events);

					if (!data.parties.length) {
						alertify.success("No events found, try different criteria");
						return;
					}

					$scope.clearMarkers();
					markerCluster.clearMarkers();
					markerSpider.clearMarkers();
					$scope.placeClientLocationMarker();

					var bounds = $scope.addMarkersToMap(data.parties);

					var latlng = $scope.search_form.location.latlng;
					$scope.partyMap.panTo(new google.maps.LatLng(latlng[1], latlng[0]));

					if ($scope.partyMarkers.length) {
						// Getting a $digest already in progress error, so I'm just wrapping it in a timeout
						// so it's the last thing on the event queue
						$timeout(function(){
							$scope.partyMap.fitBounds(bounds);
						});
					}
					$scope.gettingEvents = false;
				});

			} else {
				alertify.success("Error searching for events");
			}
		});
	}

	// Original options for the "To" dropdown. We use this as a template for the $scope.toOptions
	var toOriginalOptions = [
		{key:'0:00', value: '12:00 am'},{key:'0:30', value: '12:30 am'},{key:'1:00', value: '1:00 am'},{key:'1:30', value: '1:30 am'},{key:'2:00', value: '2:00 am'},{key:'2:30', value: '2:30 am'},{key:'3:00', value: '3:00 am'},{key:'3:30', value: '3:30 am'},{key:'4:00', value: '4:00 am'},{key:'4:30', value: '4:30 am'},{key:'5:00', value: '5:00 am'},{key:'5:30', value: '5:30 am'},{key:'6:00', value: '6:00 am'},{key:'6:30', value: '6:30 am'},{key:'7:00', value: '7:00 am'},{key:'7:30', value: '7:30 am'},{key:'8:00', value: '8:00 am'},{key:'8:30', value: '8:30 am'},{key:'9:00', value: '9:00 am'},{key:'9:30', value: '9:30 am'},{key:'10:00', value: '10:00 am'},{key:'10:30', value: '10:30 am'},{key:'11:00', value: '11:00 am'},{key:'11:30', value: '11:30 am'},{key:'12:00', value: '12:00 pm'},{key:'12:30', value: '12:30 pm'},{key:'13:00', value: '1:00 pm'},{key:'13:30', value: '1:30 pm'},{key:'14:00', value: '2:00 pm'},{key:'14:30', value: '2:30 pm'},{key:'15:00', value: '3:00 pm'},{key:'15:30', value: '3:30 pm'},{key:'16:00', value: '4:00 pm'},{key:'16:30', value: '4:30 pm'},{key:'17:00', value: '5:00 pm'},{key:'17:30', value: '5:30 pm'},{key:'18:00', value: '6:00 pm'},{key:'18:30', value: '6:30 pm'},{key:'19:00', value: '7:00 pm'},{key:'19:30', value: '7:30 pm'},{key:'20:00', value: '8:00 pm'},{key:'20:30', value: '8:30 pm'},{key:'21:00', value: '9:00 pm'},{key:'21:30', value: '9:30 pm'},{key:'22:00', value: '10:00 pm'},{key:'22:30', value: '10:30 pm'},{key:'23:00', value: '11:00 pm'},{key:'23:30', value: '11:30 pm'}
	];

	$scope.toOptions = toOriginalOptions;

	// Awesome function that will return a bunch of events
	$scope.getApiEvents = function(callback) {

		var searchLatLng = $scope.search_form.location.latlng;
		var ssd = $scope.search_form.start_date;
		var eed = $scope.search_form.end_date;

		// Search Eventful's API
		var oArgs = {
			app_key: "NdNx6C2Fp4pgxRgG"
			, location: searchLatLng[1] + ", " + searchLatLng[0]
			, within: $scope.search_form.distance
			, page_size: 50
			, date: ssd.toFormat("YYYYMMDD00") + "-" + eed.toFormat("YYYYMMDD00")
			, mature: "safe"
			};

		var page_count;

		$scope.callEventFulAPI(oArgs, function(events, page_c) {
			page_count = page_c;
			callback(events);

			for(var i = 2; i <= page_count; i++) {
				oArgs.page_number = i;
				$scope.callEventFulAPI(oArgs, function(events, page_c) {
					$scope.addMarkersToMap(events);
				});
			}

		});

	}

	$scope.callEventFulAPI = function(oArgs, callback) {

		EVDB.API.call("/events/search", oArgs, function(oData) {
			var eventFulEvents = [];

			if (oData.events) {
				for (var i = 0; i < oData.events.event.length; i++) {
					var event = oData.events.event[i];

					var party = $scope.createPartyFromEventFul(event);

					if (party) eventFulEvents.push(party);
				};
			}

			callback(eventFulEvents, oData.page_count);
		});
	}

	$scope.createPartyFromEventFul = function(event) {

		if (!event.latitude || !event.longitude) {
			return false;
		}

		return {
			name:        	event.title
		    , date_time: 	{
		    	start_date: event.start_time
		    	, end_date: event.stop_time
		    	, all_day: (event.all_day == "1" || event.all_day == "2") ? true : false
		    }
		    , location:		{latlng: [event.longitude, event.latitude], address: event.venue_name}
		    , description:  event.description ? event.description.trim() : undefined
		    , url: 			event.url
		};
	}

	$scope.addMarkersToMap = function(parties) {
		var bounds = new google.maps.LatLngBounds();
		//just in case
		$scope.initiateMapElements();

		angular.forEach(parties, function(party){
			var ll = new google.maps.LatLng(party.location.latlng[1], party.location.latlng[0]);

			var marker = new google.maps.Marker({
                position: ll
              	, icon: new google.maps.MarkerImage('/img/marker.svg', null, null, null, new google.maps.Size(40,40))
              	, title: party.name
            });

			 google.maps.event.addListener(marker, 'click', function() {
				infoWindow.close();
				infoWindow.setContent($scope.getPartyWindowContent(party));
				infoWindow.open($scope.partyMap, marker);
			 });

			$scope.partyMarkers.push(marker)
            bounds.extend(ll);
            
		});

		markerCluster.addMarkers($scope.partyMarkers);

		for (var i = 0; i < $scope.partyMarkers.length; i++) {
			markerSpider.addMarker($scope.partyMarkers[i]);
		};

		return bounds;
	}



	// Map functions and variables =======================================================================

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

    $scope.partyMarkers = [];

    // If we can use their browser's location, center to there
    if (navigator.geolocation) {
    	$scope.gettingEvents = true;

		navigator.geolocation.getCurrentPosition(function (position) {
			console.log("Got po");
			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$scope.partyMap.setCenter(initialLocation);
			$scope.partyMap.setZoom(11);
			$scope.clientLocation = position.coords;

			geocoder.getGeoFromLatLng(position.coords.latitude, position.coords.longitude, function(geo){

				$scope.search_form = {
					location: {
						latlng: [position.coords.longitude, position.coords.latitude]
						, address: geo ? geo.address : undefined
					}
					, distance: 5
					, start_date: new Date()
					, end_date: new Date().addDays(1)
					, from: new Date().getHours() + ":00"
					, to: new Date().addDays(1).getHours() + ":00"
				};

				$scope.searchParty();

			});
		}, function(err) {
			$scope.gettingEvents = false;
			$scope.noCurrentLocation = true;

			// They denied permission, open the search form
			if (err.code == 1) {
				$scope.modalView = "search";
			}
		});
	}

	$scope.placeClientLocationMarker = function() {
		if ($scope.clientLocation) {
			new google.maps.Marker({
                position: new google.maps.LatLng($scope.clientLocation.latitude, $scope.clientLocation.longitude)
              	, icon: new google.maps.MarkerImage('/img/client-location.svg', null, null, null, new google.maps.Size(25,25))
              	, title: "Your location"
              	, map: $scope.partyMap
            });
		}	
	}

	$scope.clearMarkers = function() {
		for (var i = 0; i < $scope.partyMarkers.length; i++) {
			$scope.partyMarkers[i].setMap(null);
		}
		$scope.partyMarkers = [];
	}

	$scope.initiateMapElements = function() {
		if (!markerCluster) {
			var mcOptions = {
				gridSize: 50
				, maxZoom: 15
				, styles: [{
					height: 50
					, width: 50
					, textSize: 14
					, textColor: "#333"
					, url: "/img/cluster-icon.png"
				}]
			};
			markerCluster = new MarkerClusterer($scope.partyMap, [], mcOptions);
		}

		if (!infoWindow) {
			infoWindow = new google.maps.InfoWindow();
		}

		if (!markerSpider) {
			var msOptions = {
				keepSpiderfied: true
			}
			markerSpider = new OverlappingMarkerSpiderfier($scope.partyMap, msOptions);
			markerSpider.addListener('spiderfy', function(markers) {
				infoWindow.close();
			})
		}
	}

	$scope.onMapIdle = function() {
		
	}

	$scope.onZoomChanged = function() {
		if (infoWindow) infoWindow.close();
	}

	$scope.getPartyWindowContent = function(party) {

		var sD = party.date_time.start_date ? new Date(party.date_time.start_date) : undefined;
		var eD = party.date_time.end_date ? new Date(party.date_time.end_date) : undefined;

		var timeString;
		if (party.date_time.all_day) {
			timeString = 'All day';
		} else if(!sD && !eD) {
			timeString = 'No time specified';
		} else if(!eD) {
			timeString = 'Starts at ' + sD.toFormat("H:MI P") + '<br>' + sD.toFormat("MMM D, YYYY");
		} else {
			timeString = sD.toFormat("H:MI P") + ' to ' + eD.toFormat("H:MI P") + '<br>' + sD.toFormat("MMM D, YYYY");
		}

		var contentString = 
			'<div class="party-info-window">'+
				'<h1 class="party-header">' + party.name + '</h1>'+
				'<p class="party-meta">' + party.location.address + '<br>' + timeString + '</p>' +
				'<hr>' +
				'<div class="party-content">'+
					'<p>' +
						(party.description ? party.description : 'No description provided') +
					'</p>' +
					(party.url ? '<p class="party-link">Link: <a href="' + party.url + '" target="_blank">' + party.url + '</a></p>' : '') 
				'</div>'+
		'</div>';

		return contentString;
	}

}