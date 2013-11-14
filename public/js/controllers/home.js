function HomeCtrl($scope, $http) {

	$scope.form = {location: {}};
	$scope.locationPlaceholder = "Location";
	
	$scope.createParty = function() {
		$http.post('/api/createParty', {party: $scope.form}).success(function(data){
			if (data.success) {
				$scope.modalView = "";
				alertify.success("Event created");
			}
		});
	}
	$scope.searchParty = function() {
		$http.post('/api/searchParty', {party: $scope.form}).success(function(data){
			if(data.success) {
				console.log("successful print")
			}
		});
	}
}