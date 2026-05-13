angular.module("unlMainApp").controller("processmgmtController",function processmgmtController($scope, $location, $http, $rootScope, $uibModal, $log, $timeout, $interval) {
	$scope.testAUTH("/processmgmt"); //TEST AUTH
	$scope.labid=false;
	$scope.labname=false;
	$scope.name=false;
	$scope.template=false;
	$scope.port=0;
	$scope.datagrid = {};
	////Invisible columns//END
	$('body').removeClass().addClass('hold-transition skin-blue layout-top-nav');
	//Get users //START
	$scope.getRunningNodes = function(){
	 if ( $('.nodemgmt').length != 0 ) $interval($scope.getRunningNodes,10000,1) ;
	$http.get('/api/runningnodes').then(
			function successCallback(response) {
				if ( response.data.data != undefined  ) { 
					nodesdata=Object.keys(response.data.data).map(function(key) {
						return response.data.data[key];
					});
					//console.log(nodesdata[0]['cpu']);
					$scope.datagrid.data = {};
					$scope.datagrid.data = nodesdata;
					$scope.datagrid.enableFiltering = true;
					$scope.datagrid.enableGridMenu = false
					$scope.datagrid.enableColumnResizing = true;
					$scope.datagrid.virtualizationThreshold = nodesdata.length + 1;
					$scope.datagrid.appScopeProvider = $scope;
				        $scope.datagrid.columnDefs = [
				        { name:'labname', dislpayName: 'Lab Path' , enableColumnMenu: false },
				        { name:'labid', displayName: 'Lab ID' , type: 'number', enableColumnMenu: false},
                                        { name:'username', displayName: 'Username', enableColumnMenu: false, cellTemplate: '<table><td>&nbsp;{{grid.getCellValue(row, col)}}&nbsp;</td><td class="{{( grid.getCellValue(row, grid.columns[index+4] ) == 1 ) ? \'green_dot\' : \'red_dot\'  }}"></td></table>'},
					{ name:'sat', dislpayName: 'Sat',  enableColumnMenu: false },
                                        { name:'online', displayName: 'online', visible: false },
					{ name:'name', displayName: 'Node Name', enableColumnMenu: false},
				        { name:'cpu', displayName: 'CPU usage (%)', type: 'number', enableColumnMenu: false},
				        { name:'ram', displayName: 'RAM usage (%)', type: 'number', enableColumnMenu: false},
				        { name:'disk', displayName: 'Disk usage (GB)', type: 'number', enableColumnMenu: true},
				        { name:'template', displayName: 'Template', enableColumnMenu: false},
				        { name:'url', displayName: 'Action', enableFiltering: false, enableSorting: false , enableColumnMenu: false ,
				                cellTemplate: '<a ng-if="row.entity.url.indexOf(\'token\') == -1" class="btn btn-default btn-flat btn-xs" ng-href="{{row.entity.url}}"> <i class="fa fa-desktop"></i></a>' +
            			                  '<a ng-if="row.entity.url.indexOf(\'token\') != -1" class="btn btn-default btn-flat btn-xs" ng-href="{{row.entity.url}}" target="{{row.entity.name}}_{{row.entity.port}}"> <i class="fa fa-desktop"></i></a>' +
                       			          '<button type="button" class="btn btn-flat btn-xs node{{row.entity.port}}-eve-stop " data-ng-click="grid.appScope.nodestop(row.entity.port)" style="" > <i class="glyphicon glyphicon-remove" style="color:#dd4b39;" title="Stop Node"></i></button>' +
			                          '<button type="button" class="btn hidden btn-danger btn-flat btn-xs node{{row.entity.port}}-eve-compute" data-ng-click=""  style="" > <i class="glyphicon glyphicon-cog gly-spin"></i></button>'
				        }
				        ]

				} else { 
					$scope.datagrid.data = Array() ;
				}
				//$scope.nodesdata=response.data.data;
				$.unblockUI();
			}, 
			function errorCallback(response) {
				$.unblockUI();
				console.log("Unknown Error. Why did API doesn't respond?"); $location.path("/login");}	
	);
	}
	$scope.getRunningNodes();
	//Get users //END
	/////////////////
	//Delete user //START
	$scope.nodestop = function ( port ) {
		console.log('stop node using port ' + port )
		if (confirm('Are you sure you want to stop this node ?')) {
                        $('.node'+port+'-eve-stop').hide()
                        $('.node'+port+'-eve-compute').removeClass('hidden')
			$http({
				method: 'GET',
				url: '/api/kill/node/'+port})
			.then(
				function successCallback(response) {
					//console.log(response)
					$('.node'+port+'-eve-stop').show()
					$('.node'+port+'-eve-compute').hide()
					$scope.getRunningNodes();
				},
				function errorCallback(response) {
					console.log(response)
					console.log("Unknown Error. Why did API doesn't respond?")
					$location.path("/login");
				}
			);
		} else return;
	}
	//$scope.connect ( url ) {
	//$window.open( url ) ;
	//}
	///////////////////////
	//More controllers //START
	ModalCtrl($scope, $uibModal, $log)
	//More controllers //END
});
