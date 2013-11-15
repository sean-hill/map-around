function HomeCtrl($scope, $http) {

	$scope.create_form = {location: {}};
	$scope.form = {};
	$scope.locationPlaceholder = "Location";
	$scope.today = new Date();
	
	$scope.createParty = function() {
		$http.post('/api/createParty', {party: $scope.create_form}).success(function(data){
			if (data.success) {
				$scope.modalView = "";
				alertify.success("Event created");
			}
		});
	}
	$scope.searchParty = function() {
		$http.post('/api/searchParty', {party: $scope.form}).success(function(data){
			if(data.success) {
				$scope.modalView = "";
				alertify.success("Search Performed");
			}
		});
	}
}