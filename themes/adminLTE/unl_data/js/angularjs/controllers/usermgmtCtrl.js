angular.module("unlMainApp").controller("usermgmtController",function usermgmtController($scope, $http, $rootScope, $uibModal, $log, $timeout, $interval) {
	$scope.testAUTH("/usermgmt"); //TEST AUTH
	$scope.userdata='';
	////Invisible columns//START
	$scope.sessionTime=false;
	$scope.sessionIP=false;
	$scope.currentFolder=false;
	$scope.currentLab=false;
	$scope.edituser='';
	$scope.sats = '';
	$scope.satArray = Array();
	$scope.satArrayRev = Array();
	$scope.sat = '';
        $scope.expdisplay = function(string){
                if ( string == '-1' ) return  ' '  ;
                return new Date(string*1000).toISOString().replace(/T.*/,'');
        }
	$scope.timedisplay = function(string){
		if ( string == '-1' ) return ' ' ;
		return new Date(string*1000).toISOString().replace(/.*T(.....).*/,'$1');
	}

	////Invisible columns//END
	$('body').removeClass().addClass('hold-transition skin-blue layout-top-nav');
	//Get users //START
	$scope.getUsersInfo = function(){
	if ( $('.usermgmt').length != 0 ) $interval($scope.getUsersInfo,10000,1) ;
	$http.get('/api/users/').then(
			function successCallback(response) {
				//console.log(response.data.data);
				$scope.userdata=response.data.data;
				$.unblockUI();
			}, 
			function errorCallback(response) {
				$.unblockUI();
				console.log("Unknown Error. Why did API doesn't respond?"); $location.path("/login");}	
	);
	}
	$scope.getClusterFull = function(){
		        $http({
                        method: 'GET',
                        url: '/api/clusterfullnd'})
        .then(
                        function successCallback(response) {
                                //console.log(response.data.data['admin'])
                                $scope.sats=response.data.data;
                                //$scope.roleArray =
                                $.map($scope.sats, function(value) {
                                        $scope.satArray[value['id']+" - "+value['name']]=value['id'];
                                        $scope.satArrayRev[value['id']]=value['name'];
                                });
                                $scope.getUsersInfo();
                        },
                        function errorCallback(response) {
                                console.log(response)
                                console.log("Unknown Error. Why did API doesn't respond?")
                        }
        );
	}
	$scope.displaySat = function( id ) {
		if ( id < 30 ) {
			return $scope.satArrayRev[id]
		} else if ( id & ( 1 << 30 )) {
			buf = ''
			for ( i=0 ; i < 30 ; i++ ) {
				if ( id & ( 1 << i ) ) {
					buf = buf + $scope.satArrayRev[i] + " "   
				}
			}
			return buf
		}
	}
	$scope.getClusterFull();
	//Get users //END
	/////////////////
	//Delete user //START
	$scope.deleteUser = function(username){
		console.log('hrer')
		if (confirm('Are you sure you want to delete user '+username+'?')) {
			$http({
				method: 'DELETE',
				url: '/api/users/'+username})
			.then(
				function successCallback(response) {
					//console.log(response)
					$scope.getClusterFull();
				}, 
				function errorCallback(response) {
					console.log(response)
					console.log("Unknown Error. Why did API doesn't respond?")
					toastr.options.timeOut = 5000;
                                        toastr["error"](response.data.message, "Error")
					//$location.path("/login");
				}
			);
		} else return;
	}
	//Delete user //END
	//////////////////
	//Kick User  //START
        $scope.kickUser = function(username){
		if (confirm('Are you sure you want to kick user '+username+'?')) {
			$http({
				method: 'POST',
				url: '/api/users/kick/'+username})
			.then(
				function successCallback(response) {
                                        //console.log(response)
                                        $scope.getClusterFull();
                                },
                                function errorCallback(response) {
                                        console.log(response)
                                        console.log("Unknown Error. Why did API doesn't respond?")
                                        $location.path("/login");
                                }
                        );
                } else return;
        }
	//EditUser 
	$scope.editUser= function(user){
		console.log ( "edit pod " + user.pod ) 
		$scope.podId = user.pod
		$scope.openModal('edituser', user.username)
	}
	//Kick User //END
	////////////////////////
	//Time converter //START
	$scope.timeConverter = function(UNIX_timestamp){
		var a = new Date(UNIX_timestamp * 1000);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		var sec = a.getSeconds();
		var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
		return time;
	}
	//Time converter //END
	///////////////////////
	//More controllers //START
	ModalCtrl($scope, $uibModal, $log)
	//More controllers //END
});
