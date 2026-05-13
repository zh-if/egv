angular.module("unlMainApp").controller("labmgmtController",function labmgmtController($scope, $location, $window, $http, $rootScope, $uibModal, $log, $timeout, $interval) {
	$('.eve-compute').hide()
	$scope.testAUTH("/labmgmt"); //TEST AUTH
	$scope.labid=false;
	$scope.labname=false;
	$scope.name=false;
	$scope.template=false;
	$scope.datagrid = {};
	//$scope.username=false;
	$scope.port=0;
	////Invisible columns//END
	$('body').removeClass().addClass('hold-transition skin-blue layout-top-nav');
	//Get users //START
	$scope.getRunningLabs = function(){

	if ( $('.labmgmt').length != 0 ) $interval($scope.getRunningLabs,10000,1) ;
	
	$http.get('/api/runninglabs').then(
			function successCallback(response) {
				//console.log(response.data.data);
				/*
				if ( response.data.data != undefined  ) { 
					nodesdata=Object.keys(response.data.data).map(function(key) {
						return response.data.data[key];
					});
					$scope.nodesdata = nodesdata;
				} else { 
					$scope.nodesdata = Array() ;
				}
				*/
				//$scope.nodesdata=response.data.data;
                                if ( response.data.data != undefined  ) {
                                        nodesdata=Object.keys(response.data.data).map(function(key) {
                                                return response.data.data[key];
                                        });
                                        $scope.datagrid.data = {};
                                        $scope.datagrid.data = nodesdata;
                                        $scope.datagrid.enableFiltering = true;
                                        $scope.datagrid.enableGridMenu = false;
					$scope.datagrid.enableColumnResizing = true;
					$scope.datagrid.virtualizationThreshold = nodesdata.length + 1;
                                        $scope.datagrid.appScopeProvider = $scope;
                                        $scope.datagrid.columnDefs = [
                                        { name:'labname', dislpayName: 'Lab Path' , enableColumnMenu: false },
					{ name:'labid', displayName: 'State', enableFiltering: false, enableColumnMenu: false , maxWidth: 80  ,enableSorting: true, cellTemplate: '<center><table><td class="{{( grid.getCellValue(row,col) < 1000 ) ? \'green_dot\' : \'red_dot\'  }}"></td></table></center>'},
                                        { name:'uuid', displayName: 'Lab UUID' , enableColumnMenu: false},
					{ name:'sat_name', displayName: 'Satellite', enableColumnMenu: false},
                                        { name:'username', displayName: 'Username', enableColumnMenu: false, cellTemplate: '<table><td>&nbsp;{{grid.getCellValue(row, col)}}&nbsp;</td><td class="{{( grid.getCellValue(row, grid.columns[index+5] ) == 1 ) ? \'green_dot\' : \'red_dot\'  }}"></td></table>'},
					{ name:'online', displayName: 'online', visible: false },
                                        { name:'cpu', displayName: 'CPU usage (%)' , enableColumnMenu: false, type: 'number', enableFiltering: false },
                                        { name:'mem', displayName: 'Memory usage (%)' , enableColumnMenu: false, type: 'number', enableFiltering: false },
                                        { name:'size', displayName: 'Disk usage (GB)' , enableColumnMenu: false, type: 'number', enableFiltering: true },
                                        { name:'url', displayName: 'Action', enableFiltering: false, enableSorting: true , enableColumnMenu: false ,
                                                cellTemplate: '<button type="button" class="btn btn-default btn-flat btn-xs" data-ng-click="grid.appScope.legacylabidopen( row.entity.labname, row.entity.podid )"> <i class="glyphicon glyphicon-blackboard" title="Open Lab"></i></button>' +
                                                  '<button ng-if="row.entity.labid < 1001" type="button" class="btn btn-flat btn-xs lab{{row.entity.labid}}-eve-stop" data-ng-click="grid.appScope.labstop( row.entity.labid )"> <i class="glyphicon glyphicon-remove" style="color:#dd4b39;" title="Stop Lab"></i></button>' +
                                                  '<button ng-if="row.entity.labid > 1000" type="button" class="btn btn-danger btn-flat btn-xs lab{{row.entity.labid}}-eve-wipe" data-ng-click="grid.appScope.labwipe( row.entity.labi, row.entity.labname, row.entity.uuid, row.entity.podid )"> <i class="glyphicon glyphicon-erase" title="Wipe Lab"></i></button>' +
                                                  '<button type="button" class="btn hidden btn-danger btn-flat btn-xs lab{{row.entity.labid}}-eve-compute" data-ng-click=""  style="" > <i class="glyphicon glyphicon-cog gly-spin"></i></button>'
                                        }
                                        ]

                                } else {
                                        $scope.datagrid.data = Array() ;
                                }
                                //$scope.nodesdata=response.data.data;
                                //$.unblockUI();

				$.unblockUI();
			}, 
			function errorCallback(response) {
				$.unblockUI();
				console.log("Unknown Error. Why did API doesn't respond?"); $location.path("/login");}	
	);
	}
	$scope.getRunningLabs();
	//Get users //END
	/////////////////
	//Delete user //START
	$scope.labstop = function ( labId ) {
		console.log('stop Lab ' + labId )
		if (confirm('Are you sure you want to stop this lab ?')) {
			$('.lab'+labId+'-eve-stop').hide()
			$('.lab'+labId+'-eve-compute').removeClass('hidden')
			$http({
				method: 'GET',
				url: '/api/kill/lab/'+labId})
			.then(
				function successCallback(response) {
					//console.log(response)
					$scope.getRunningLabs();
					$('.lab'+labId+'-eve-stop').show()
					$('.lab'+labId+'-eve-compute').addClass('hidden')
				},
				function errorCallback(response) {
					console.log(response)
					console.log("Unknown Error. Why did API doesn't respond?")
					$location.path("/login");
				}
			);
		} else return;
	}
        $scope.labwipe = function ( labId, labname, labuuid, podid ) {
                console.log('wipe Lab ' + labname )
                if (confirm('Are you sure you want to wipe this lab ?')) {
                        $('.lab'+labId+'-eve-wipe').hide()
                        $('.lab'+labId+'-eve-compute').removeClass('hidden')
                        $http({
                                method: 'GET',
                                url: '/api/wipe/'+podid+'/'+labuuid})
                        .then(
                                function successCallback(response) {
                                        //console.log(response)
                                        $scope.getRunningLabs();
                                        $('.lab'+labId+'-eve-wipe').show()
                                        $('.lab'+labId+'-eve-compute').addClass('hidden')
                                },
                                function errorCallback(response) {
                                        console.log(response)
                                        console.log("Unknown Error. Why did API doesn't respond?")
                                        $location.path("/login");
                                }
                        );
                } else return;
        }
        $scope.legacylabidopen = function(labname,podid){
               $http.get('/api/labs'+labname+'.unl/topology/'+podid).then(
			function successCallback(response) {
				$window.location.href = "legacy"+labname+".unl/topology";
			},
			function errorCallback(response) {
				$.unblockUI();
				console.log("Unknown Error. Why did API doesn't respond?");
			}
	);}

	//$scope.connect ( url ) {
	//$window.open( url ) ;
	//}
	///////////////////////
	//More controllers //START
	ModalCtrl($scope, $uibModal, $log)
	//More controllers //END
});
