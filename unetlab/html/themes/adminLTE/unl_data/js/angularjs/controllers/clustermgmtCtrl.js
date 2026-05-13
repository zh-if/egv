angular.module("unlMainApp").controller("clustermgmtController",function clustermgmtController($scope, $http, $location, $rootScope, $uibModal, $log, $timeout, $interval) {
	$scope.testAUTH("/clustermgmt"); //TEST AUTH
	$scope.userdata='';
	$scope.datagrid = {}
	////Invisible columns//START
	$scope.sat='';
	$scope.Math = window.Math;
	$scope.loaded = 0;

	////Invisible columns//END
	$('body').removeClass().addClass('hold-transition skin-blue layout-top-nav');
	//Get users //START
	
        $scope.percentageToHsl = function(percentage, hue0, hue1) {
                var hue = (percentage * (hue1 - hue0)) + hue0;
                return 'hsl(' + hue + ', 60%, 50%)';
        }


	$scope.getClusterInfo = function(){
	//if ( $('.usermgmt').length != 0 ) $interval($scope.getUsersInfo,10000,1) ;
	$http.get('/api/cluster').then(
			function successCallback(response) {
				//console.log(response.data.data);
				if ( response.data.data != undefined  ) {
                                        clusterdata=Object.keys(response.data.data).map(function(key) {
                                                return response.data.data[key];
                                        });
                                        $scope.datagrid.data = {};
                                        $scope.datagrid.data = clusterdata;
                                        $scope.datagrid.enableFiltering = true;
                                        $scope.datagrid.enableGridMenu = false;
                                        $scope.datagrid.enableColumnResizing = true;
                                        $scope.datagrid.virtualizationThreshold = clusterdata.length + 1;
                                        $scope.datagrid.appScopeProvider = $scope;
                                        $scope.datagrid.columnDefs = [
                                        { name:'id', displayName: 'Id' , enableColumnMenu: false, enableFiltering: false, width: 30 },
                                        { name:'name', dislpayName: 'Satellite name' , enableColumnMenu: false, cellTemplate: '<table><td>&nbsp;{{grid.getCellValue(row, col)}}&nbsp;</td><td class="{{( grid.getCellValue(row, grid.columns[index+2] ) == 1 ) ? \'green_dot\' : ( grid.getCellValue(row, grid.columns[index+2] ) == -1 ) ? \'yellow_dot\' : \'red_dot\'  }}"></td></table>'  },
                                        { name:'online', displayName: 'online', visible: false },
                                        //{ name:'pubkey', displayName: 'Key' , enableColumnMenu: false, type: 'number', enableFiltering: false },
					{ name:'cpu', displayName: 'CPUs' , enableColumnMenu: false, type: 'number', enableFiltering: false },
					//{ name:'live_cpu', displayName: 'CPU Usage (%)' , enableColumnMenu: false, type: 'number', enableFiltering: false, cellTemplate: '<p>&nbsp;{{grid.getCellValue(row, col)}}&nbsp;%</p>' },
					{ name:'live_cpu', displayName: 'CPU Usage (%)' , enableColumnMenu: false, type: 'number', enableFiltering: false,
						cellTemplate: '<uib-progressbar value="row.entity.live_cpu"><span>{{row.entity.live_cpu}}</span></uib-progressbar>' },
					{ name:'ram', displayName: 'Memory (GB)' , enableColumnMenu: false, type: 'number', enableFiltering: false, cellTemplate: '<p>{{ (grid.getCellValue(row, col)/1024/1024).toFixed(0)  }}</p>' },
					{ name:'live_ram', displayName: 'Memory Usage (%)' , enableColumnMenu: false, type: 'number', enableFiltering: false, 
						cellTemplate: '<uib-progressbar value="( row.entity.ram - row.entity.live_ram)/row.entity.ram * 100"><span>{{(( row.entity.ram - row.entity.live_ram)/row.entity.ram * 100).toFixed(0)}}</span></uib-progressbar>' },
					{ name:'swap', displayName: 'Swap (GB)' , enableColumnMenu: false, type: 'number', enableFiltering: false, cellTemplate: '<p>{{ (grid.getCellValue(row, col)/1024/1024).toFixed(0)  }}</p>'  },
					{ name:'live_swap', displayName: 'Swap Usage (%)' , enableColumnMenu: false, type: 'number', enableFiltering: false,
						cellTemplate: '<uib-progressbar value="( row.entity.swap - row.entity.live_swap)/((row.entity.swap == 0) ? 1 : row.entity.swap) * 100"><span>{{(( row.entity.swap - row.entity.live_swap)/((row.entity.swap == 0) ? 1 : row.entity.swap ) * 100).toFixed(0)  }}</span></uib-progressbar>'},
					{ name:'disk', displayName: 'Disk Size (GB)' , enableColumnMenu: false, type: 'number', enableFiltering: false, cellTemplate: '<p>{{ (grid.getCellValue(row, col)/1000000).toFixed(0)  }}</p>' },
					{ name:'disk_usage', displayName: 'Disk usage' , enableColumnMenu: false, type: 'number', enableFiltering: false,
						cellTemplate: '<uib-progressbar value="( row.entity.disk_usage)/row.entity.disk * 100"><span>{{(( row.entity.disk_usage)/row.entity.disk * 100).toFixed(0)}}</span></uib-progressbar>'},
                                        { name:'url', displayName: 'Action', enableFiltering: false, enableSorting: false , enableColumnMenu: false ,
						cellTemplate: '<table><td><button type="button" class="btn btn-danger btn-flat btn-xs {{( row.entity.id == 0 ) ? \'hidden\' : \'visible\'}} " data-ng-click="grid.appScope.deleteSat(row.entity.id)"> <i class="fa fa-trash-o"  title="Remove member"></i></button></td>'+
						'<td><button type="button" class="btn btn-flat btn-xs {{( row.entity.id == 0 ) ? \'hidden\' : (  row.entity.online  == 0 ) ? \'hidden\' : \'visible\'}} " data-ng-click="grid.appScope.stopSat(row.entity.id)"> <i class="fa fa-power-off"  title="Shutdown member"></i></button></td>'+
						'<td><button type="button" class="btn btn-flat btn-xs {{( row.entity.id == 0 ) ? \'hidden\' : (  row.entity.online  == 0 ) ? \'hidden\' : \'visible\'}} " data-ng-click="grid.appScope.resetSat(row.entity.id)"> <i class="fa fa-repeat" title="Reboot member"></i></button></td>'+
						'<td><button type="button" class="btn btn-flat btn-xs {{( row.entity.id == 0 ) ? \'hidden\' : (  row.entity.online  == 0 ) ? \'visible\' : \'hidden\'}} " data-ng-click="grid.appScope.purgeSat(row.entity.id)"> <i class="fa fa-eraser" title="Purge member"></i></button></td></table>'
                                        }
						//<button type="button" class="btn btn-danger btn-flat btn-xs" data-ng-click="deleteUser( y.username )"> <i class="fa fa-trash-o"></i></button>
                                        ]

                                } else {
                                        $scope.datagrid.data = Array() ;
                                }
				// update colors
				$('.progress-bar').each(function (){
					var $this = $(this);
					value = $this.attr("aria-valuenow")
					$this.css("background-color",$scope.percentageToHsl(value/100,128,0))
				})
                                $.unblockUI();
                        },
			function errorCallback(response) {
				$.unblockUI();
				$scope.datagrid.data = Array() ;
				console.log("Unknown Error. Why did API doesn't respond?"); }	
	);
	}
	$scope.getClusterInfo()
	$scope.clusterrefresh = $interval(function () {
                        if ($location.path() == '/clustermgmt') {
				$scope.getClusterInfo()
			} else {
				$interval.cancel($scope.clusterrefresh)
			}
        }, 5000);
	//Get users //END
	/////////////////
	//Delete Satelite //START
	$scope.deleteSat = function(sat){
		if (confirm('Are you sure you want to delete satellite '+sat+'?')) {
			$http({
				method: 'DELETE',
				url: '/api/cluster/'+sat})
			.then(
				function successCallback(response) {
					//console.log(response)
					$scope.getClusterInfo()
				}, 
				function errorCallback(response) {
					if (response.status == 400 && response.data.status == 'fail') {
                                        	$scope.errorMessage=response.data.message;
                                        	$scope.errorClass='has-error';
						toastr["error"](response.data.message, "Error")
                                        return;
                                	}
					console.log(response)
					console.log("Unknown Error. Why did API doesn't respond?")
					$location.path("/login");
				}
			);
		} else return;
	}
	//Stop Satelite //START
	$scope.stopSat = function(sat){
		if (confirm('Are you sure you want to shutdown satellite '+sat+'?')) {
			 $http({
				 method: 'GET',
				 url: '/api/stopcluster/'+sat})
			.then(
				function successCallback(response) {
					$scope.getClusterInfo()
					},
				function errorCallback(response) {
					if (response.status == 400 && response.data.status == 'fail') {
						$scope.errorMessage=response.data.message;
						$scope.errorClass='has-error';
						toastr["error"](response.data.message, "Error")
						return;
					}
					console.log(response)
					console.log("Unknown Error. Why did API doesn't respond?")
					$location.path("/login");
				}
			);
		} else return;
	}

	//Reboot Satelite //START
        $scope.resetSat = function(sat){
                if (confirm('Are you sure you want to reboot satellite '+sat+'?')) {
                         $http({
                                 method: 'GET',
                                 url: '/api/resetcluster/'+sat})
                        .then(
                                function successCallback(response) {
                                        $scope.getClusterInfo()
                                        },
                                function errorCallback(response) {
                                        if (response.status == 400 && response.data.status == 'fail') {
                                                $scope.errorMessage=response.data.message;
                                                $scope.errorClass='has-error';
                                                toastr["error"](response.data.message, "Error")
                                                return;
                                        }
                                        console.log(response)
                                        console.log("Unknown Error. Why did API doesn't respond?")
                                        $location.path("/login");
                                }
                        );
                } else return;
        }
	//Purge Satelite //START
        $scope.purgeSat = function(sat){
                if (confirm('Are you sure you want to remove all running consoles  satellite '+sat+'?')) {
                         $http({
                                 method: 'GET',
                                 url: '/api/purgecluster/'+sat})
                        .then(
                                function successCallback(response) {
                                        $scope.getClusterInfo()
                                        },
                                function errorCallback(response) {
                                        if (response.status == 400 && response.data.status == 'fail') {
                                                $scope.errorMessage=response.data.message;
                                                $scope.errorClass='has-error';
                                                toastr["error"](response.data.message, "Error")
                                                return;
                                        }
                                        console.log(response)
                                        console.log("Unknown Error. Why did API doesn't respond?")
                                        $location.path("/login");
                                }
                        );
                } else return;
        }
	


	
	//Delete user //END
	////////////////////////
	//More controllers //START
	ModalCtrl($scope, $uibModal, $log)
	//More controllers //END
});
