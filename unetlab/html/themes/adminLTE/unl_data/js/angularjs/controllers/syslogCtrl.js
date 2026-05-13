angular.module("unlMainApp").controller("syslogController",function syslogController($scope, $http, $uibModal, $log,$rootScope) {
	$scope.testAUTH("/syslog"); //TEST AUTH
	$('body').removeClass().addClass('hold-transition skin-blue layout-top-nav');
	$scope.fileselect=false;
	$scope.lineCount=20;
	$scope.searchText='';
	$scope.logInfo=[];
	$scope.accessLog=[];
	$scope.apiLog=[];
	$scope.errorLog=[];
	$scope.php_errorsLog=[];
	$scope.unl_wrapperLog=[];
	$scope.blockButtons=false;
	$scope.blockButtonsClass='';
	// api.txt  php_errors.txt  ssl-access.log  ssl-error.log  unl_wrapper.txt
	$scope.logfiles= ['ssl-access.log','license service','process-scanner','local units','api.txt','ssl-error.log','php_errors.txt','unl_wrapper.txt','cpulimit.log']
	
	$scope.readFile = function(filename){
		//console.log(filename)
		filename = (filename === undefined) ? $scope.fileSelection : filename
		$scope.blockButtons=true;
		$scope.blockButtonsClass='m-progress';
		$scope.logInfo=[];
		$http.get('/api/logs/'+filename+'/'+$scope.lineCount+'/'+$scope.searchText).then(
			function successCallback(response) {
				//console.log(response.data)
				$scope.fileselect=true;	
				$scope.logInfo=response.data;
				$.unblockUI();
				$scope.blockButtons=false;
				$scope.blockButtonsClass='';
			}, 
			function errorCallback(response) {
				console.log(response)
				console.log("Unknown Error. Why did API doesn't respond?"); $location.path("/login");
				$.unblockUI();
				$scope.blockButtons=false;
				$scope.blockButtonsClass='';
				}	
		);
	}
	$scope.readFile('ssl-access.log')
        // Add modal controller
        ModalCtrl($scope, $uibModal, $log)
});
