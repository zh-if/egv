angular.module("unlMainApp").controller("sysstatController",function sysstatController($scope, $http, $rootScope, $uibModal, $log, $interval, $location,$timeout) {
        $("#ToggleUKSM").toggleSwitch({width: "50px"});
        $("#ToggleKSM").toggleSwitch({width: "50px"});
        $("#ToggleCPULIMIT").toggleSwitch({width: "50px"});
	$scope.testAUTH("/sysstat"); //TEST AUTH
	$scope.versiondata='';
	$scope.serverstatus=[];
	$scope.valueCPU = 0;
	$scope.valueMem = 0;
	$scope.valueSwap = 0;
	$scope.valueDisk = 0;
	$scope.optionsCPU = {
		unit: "%",
		readOnly: true,
		size: 175,
		subText: {
			enabled: true,
			text: 'CPU used',
			color: 'gray',
			font: 'auto'
		},
		trackWidth: 10,
		barWidth: 15,
		trackColor: '#656D7F',
		barColor: '#2CC185',
		animate: { enabled: true, duration: 150, ease: 'bounce' }
	};
	$scope.optionsSATCPU = {
                unit: "%",
                readOnly: true,
                size: 80,
                subText: {
                        enabled: true,
                        text: 'CPU used',
                        color: 'gray',
                        font: 'auto'
                },
                trackWidth: 2,
                barWidth: 4,
                trackColor: '#656D7F',
                barColor: '#2CC185',
                animate: { enabled: true, duration: 150, ease: 'bounce' }
        };
	$scope.optionsSATMEM = {
                unit: "%",
                readOnly: true,
                size: 80,
                subText: {
                        enabled: true,
                        text: 'Mem used',
                        color: 'gray',
                        font: 'auto'
                },
                trackWidth: 2,
                barWidth: 4,
                trackColor: '#656D7F',
                barColor: '#2CC185',
                animate: { enabled: true, duration: 150, ease: 'bounce' }
        };
	$scope.optionsSATSWAP = {
                unit: "%",
                readOnly: true,
                size: 80,
                subText: {
                        enabled: true,
                        text: 'Swap used',
                        color: 'gray',
                        font: 'auto'
                },
                trackWidth: 2,
                barWidth: 4,
                trackColor: '#656D7F',
                barColor: '#2CC185',
                animate: { enabled: true, duration: 150, ease: 'bounce' }
        };
	$scope.optionsSATDISK = {
                unit: "%",
                readOnly: true,
                size: 80,
                subText: {
                        enabled: true,
                        text: 'DISK used',
                        color: 'gray',
                        font: 'auto'
                },
                trackWidth: 2,
                barWidth: 4,
                trackColor: '#656D7F',
                barColor: '#2CC185',
                animate: { enabled: true, duration: 150, ease: 'bounce' }
        };
	
	$scope.optionsMem = {
		unit: "%",
		readOnly: true,
		size: 175,
		subText: {
			enabled: true,
			text: 'Memory used',
			color: 'gray',
			font: 'auto'
		},
		trackWidth: 10,
		barWidth: 15,
		trackColor: '#656D7F',
		barColor: '#2CC185',
		animate: { enabled: true, duration: 150, ease: 'bounce' }
	};
	
	$scope.optionsSwap = {
		unit: "%",
		readOnly: true,
		size: 175,
		subText: {
			enabled: true,
			text: 'Swap used',
			color: 'gray',
			font: 'auto'
		},
		trackWidth: 10,
		barWidth: 15,
		trackColor: '#656D7F',
		barColor: '#2CC185',
		animate: { enabled: true, duration: 150, ease: 'bounce' }
	};
	
	
	$scope.optionsDisk = {
		unit: "%",
		readOnly: true,
		size: 175,
		subText: {
			enabled: true,
			text: 'Disk used',
			color: 'gray',
			font: 'auto'
		},
		trackWidth: 10,
		barWidth: 15,
		trackColor: '#656D7F',
		barColor: '#2CC185',
		animate: { enabled: true, duration: 150, ease: 'bounce' }
	};
	$('body').removeClass().addClass('hold-transition skin-blue layout-top-nav');
	$scope.systemstat = function(){
		$http.get('/api/status').then(
				function successCallback(response) {
					//console.log(response.data.data)
					$scope.serverstatus=response.data.data;
					$scope.valueCPU = $scope.serverstatus.cpu;
					$scope.vCPU = $scope.serverstatus.vCPU;
					$scope.valueMem = $scope.serverstatus.mem;
					$scope.MemTotal = Math.round( $scope.serverstatus.memtotal / 1024 / 1024 );
					$scope.valueSwap = $scope.serverstatus.swap;
					$scope.SwapTotal = Math.round( $scope.serverstatus.swapavailable / 1024 / 1024);
					$scope.valueDisk = $scope.serverstatus.disk;
					$scope.DiskTotal = Math.round($scope.serverstatus.diskavailable);
					$scope.versiondata="Current API version: "+response.data.data.version;
                                        window.uksm = false;
                                        window.ksm = false;
                                        window.cpulimit = false;
                                        if ( response.data.data.uksm == "unsupported" )  $("#pUKSM").addClass('hidden')
                                        if ( response.data.data.ksm == "unsupported" )  $("#pKSM").addClass('hidden')
                                        if ( response.data.data.uksm == "enabled" ) {
                                                window.uksm = true;
						$("#ToggleUKSM").toggleCheckedState(true)
                                        }
                                        if ( response.data.data.ksm == "enabled" ) {
                                                window.ksm = true;
                                                $("#ToggleKSM").toggleCheckedState(true)
                                        }
                                        if ( response.data.data.cpulimit == "enabled" ) {
                                                window.cpulimit = true;
                                                $("#ToggleCPULIMIT").toggleCheckedState(true)
                                        }
					$.unblockUI();
				}, 
				function errorCallback(response) {
					$.unblockUI();
					console.log("Unknown Error. Why did API doesn't respond?"); $location.path("/login");}	
		);
	}
	$scope.systemstat()
	$scope.clusterstat = function(){
		$http.get('/api/cluster').then(
			 function successCallback(response) {
				 $scope.sats = {}
				 $scope.sats=Object.keys(response.data.data).map(function(key) {
                                                return response.data.data[key];
                                 });
				 if  ( $scope.sats.length == 1 ) $scope.sats = {}
				 // $scope.sats={ $scope.sats, $scope.sats }
				 //$scope.sats = response.data.data;
				 for ( i = 0 ; i < $scope.sats.length ; i++  ) {
					 console.log ( $scope.sats[i] )
					 $scope.sats[i].valueMem =  Math.round(  ($scope.sats[i].ram - $scope.sats[i].live_ram) /  $scope.sats[i].ram * 100 )
					 $scope.sats[i].MemTotal = Math.round( $scope.sats[i].ram  / 1024 / 1024 )
					 $scope.sats[i].valueSwap =  Math.round( (  $scope.sats[i].swap - $scope.sats[i].live_swap )  /  $scope.sats[i].swap )
					 $scope.sats[i].SwapTotal = Math.round( $scope.sats[i].swap  / 1024 / 1024 )
					 $scope.sats[i].valueDisk =  Math.round( $scope.sats[i].disk_usage /  $scope.sats[i].disk  *100)
					 $scope.sats[i].DiskTotal = Math.round( $scope.sats[i].disk / 1000000 )
				 }
				 //console.log( $scope.sats ) 
			 },
			function errorCallback(response) {
				console.log("Unknown Error. Why did API doesn't respond?");
			}
		);
	}
	$scope.clusterstat()
	$interval(function () {
			if ($location.path() == '/sysstat') {
				$scope.systemstat()
				$scope.clusterstat()
			}
    }, 2000);
	        // Stop All Nodes //START
        //$app -> delete('/api/status', function() use ($app, $db) {
        $scope.stopAll = function() {
                $http({
                        method: 'DELETE',
                        url: '/api/status'})
                        .then(
                                function successCallback(response) {
                                        console.log(response)
                                },
                                function errorCallback(response) {
                                        console.log(response)
                                }
                        );
        }
        // Stop All Nodes //STOP
	// Add modal controller
	ModalCtrl($scope, $uibModal, $log);
});
// set cpulimit
function setCpuLimit(bool) {
    var deferred = $.Deferred();
    var form_data = {};

    form_data['state'] = bool;

    var url = '/api/cpulimit';
    var type = 'POST';
    $.ajax({
        cache: false,
        timeout: 30000,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                deferred.resolve(data);
            } else {
                // Application error
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// set uksm
function setUksm(bool) {
    var deferred = $.Deferred();
    var form_data = {};

    form_data['state'] = bool;

    var url = '/api/uksm';
    var type = 'POST';
    $.ajax({
        cache: false,
        timeout: 30000,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                deferred.resolve(data);
            } else {
                // Application error
                deferred.reject(data['message']);
            }

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}


// set ksm
function setKsm(bool) {
    var deferred = $.Deferred();
    var form_data = {};

    form_data['state'] = bool;

    var url = '/api/ksm';
    var type = 'POST';
    $.ajax({
        cache: false,
        timeout: 30000,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                deferred.resolve(data);
            } else {
                // Application error
                deferred.reject(data['message']);
            }

        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// CPULIMIT Toggle

$(document).on('change','#ToggleCPULIMIT', function (e) {
 if  ( e.currentTarget.id == 'ToggleCPULIMIT' ) {
        var status=$('#ToggleCPULIMIT').prop('checked');
         if ( status != window.cpulimit ) setCpuLimit (status);
 }
});

// UKSM Toggle

$(document).on('change','#ToggleUKSM', function (e) {
 if  ( e.currentTarget.id == 'ToggleUKSM' ) {
        var status =$('#ToggleUKSM').prop('checked')
        if ( status != window.uksm ) setUksm(status);
 }
});

// KSM Toggle

$(document).on('change','#ToggleKSM', function (e) {
 if  ( e.currentTarget.id == 'ToggleKSM' ) {
        var status =$('#ToggleKSM').prop('checked')
        if ( status != window.ksm ) setKsm(status);
 }
});
