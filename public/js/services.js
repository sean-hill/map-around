'use strict';

angular.module('myapp.services', [])
	.service('geocoder', function() {
	    this.getGeoFromLatLng = function(lat, lng, callback) {

	        var latlng = new google.maps.LatLng(lat,lng);
	        var geocoder = new google.maps.Geocoder();

			geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK && results[0]) {
						console.log(results);
						return callback({
							address: results[0].formatted_address
							, lat: results[0].geometry.location.lat()
							, lng: results[0].geometry.location.lng()
						});

				} else {
					callback(false);
				}
			});
	    };
	})
;