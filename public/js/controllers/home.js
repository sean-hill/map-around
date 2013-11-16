function HomeCtrl($scope, $http) {

	$scope.create_form = {location: {}};
	$scope.form = {};
	$scope.locationPlaceholder = "Location";
	$scope.today = new Date();
	
	$scope.createParty = function() {

		var startDate;
		var endDate;

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

		}

		console.log(startDate.toFormat("MMM D, YYYY -- H:MI PP"));
		console.log(endDate.toFormat("MMM D, YYYY -- H:MI PP"));

		$scope.create_form.date_time = {start_date: startDate, end_date: endDate};

		$http.post('/api/createParty', {party: $scope.create_form}).success(function(data){
			if (data.success) {
				$scope.modalView = "";
				$scope.create_form = {};
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
		$http.post('/api/searchParty', {party: $scope.form}).success(function(data){
			if(data.success) {
				$scope.modalView = "";
				alertify.success("Search Performed");
			}
		});
	}

	var toOriginalOptions = [
		{key:'0:00', value: '12:00 am'},
		{key:'0:30', value: '12:30 am'},
		{key:'1:00', value: '1:00 am'},
		{key:'1:30', value: '1:30 am'},
		{key:'2:00', value: '2:00 am'},
		{key:'2:30', value: '2:30 am'},
		{key:'3:00', value: '3:00 am'},
		{key:'3:30', value: '3:30 am'},
		{key:'4:00', value: '4:00 am'},
		{key:'4:30', value: '4:30 am'},
		{key:'5:00', value: '5:00 am'},
		{key:'5:30', value: '5:30 am'},
		{key:'6:00', value: '6:00 am'},
		{key:'6:30', value: '6:30 am'},
		{key:'7:00', value: '7:00 am'},
		{key:'7:30', value: '7:30 am'},
		{key:'8:00', value: '8:00 am'},
		{key:'8:30', value: '8:30 am'},
		{key:'9:00', value: '9:00 am'},
		{key:'9:30', value: '9:30 am'},
		{key:'10:00', value: '10:00 am'},
		{key:'10:30', value: '10:30 am'},
		{key:'11:00', value: '11:00 am'},
		{key:'11:30', value: '11:30 am'},
		{key:'12:00', value: '12:00 pm'},
		{key:'12:30', value: '12:30 pm'},
		{key:'13:00', value: '1:00 pm'},
		{key:'13:30', value: '1:30 pm'},
		{key:'14:00', value: '2:00 pm'},
		{key:'14:30', value: '2:30 pm'},
		{key:'15:00', value: '3:00 pm'},
		{key:'15:30', value: '3:30 pm'},
		{key:'16:00', value: '4:00 pm'},
		{key:'16:30', value: '4:30 pm'},
		{key:'17:00', value: '5:00 pm'},
		{key:'17:30', value: '5:30 pm'},
		{key:'18:00', value: '6:00 pm'},
		{key:'18:30', value: '6:30 pm'},
		{key:'19:00', value: '7:00 pm'},
		{key:'19:30', value: '7:30 pm'},
		{key:'20:00', value: '8:00 pm'},
		{key:'20:30', value: '8:30 pm'},
		{key:'21:00', value: '9:00 pm'},
		{key:'21:30', value: '9:30 pm'},
		{key:'22:00', value: '10:00 pm'},
		{key:'22:30', value: '10:30 pm'},
		{key:'23:00', value: '11:00 pm'},
		{key:'23:30', value: '11:30 pm'}
	];

	$scope.toOptions = toOriginalOptions;
}