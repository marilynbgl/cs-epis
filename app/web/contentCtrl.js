'use strict';

//controlador principal de toda la aplicacion
miApp.controller('contentCtrl', ['$scope','$mdDialog','$mdToast','recursoCrud','upload',function($scope,$mdDialog,$mdToast,recursoCrud,upload) {

	$scope.container = JSON.parse( localStorage.getItem('container') );
	$scope.cont = {};
	$scope.regSel = {};

	$scope.listRegisters = [];

	$scope.list = function (){

		recursoCrud.listar("ContentService.php", {accion:1,ConID:$scope.container.ConID} ).then(
			function(data) {
				$scope.listRegisters = data.data;
			}, function(data) {
				$mdToast.show($mdToast.simple().textContent(data).position('top right').hideDelay(6000));
			}, function(data) {
				$mdToast.show($mdToast.simple().textContent(data).position('top right').hideDelay(6000));
			}
		);
	};


	$scope.prepareNew = function(ev){
		$mdDialog.show({
			controller: DialogContent,
			templateUrl: 'web/dialogContent.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			locals: {title:'Nuevo Contenido', data: {}}
		})
		.then(function(res) {
			//guardadno lo cambios hechos
			$scope.cont = res;
			$scope.newRegister();

		}, function() {
			//cancelando la funcion
		});
	};
	$scope.prepareUpdate = function(ev,c){
		$scope.regSel = c;
		$mdDialog.show({
			controller: DialogContent,
			templateUrl: 'web/dialogContent.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			locals: {title:'Editar Contenido', data: c}
		})
		.then(function(res) {
			//guardadno lo cambios hechos

			$scope.updateRegister(res);

		}, function() {
			//cancelando la funcion
		});
	};


	$scope.newRegister = function (){

		$scope.cont.ConID = $scope.container.ConID;

		recursoCrud.insertar("ContentService.php", $scope.cont ).then(

			function(data) {
				$mdToast.show($mdToast.simple().textContent(data.mensaje).position('top right').hideDelay(2000));
				if(data.estado){
					$scope.cont.ConInfID = data.ID;
					$scope.listRegisters.push($scope.cont);

					$scope.cont = {};

				}
			}, function(data) {
				$mdToast.show($mdToast.simple().textContent(data).position('top right').hideDelay(6000));
			}, function(data) {
				$mdToast.show($mdToast.simple().textContent(data).position('top right').hideDelay(6000));
			}
		);
	};

	$scope.updateRegister = function (c){

		var register = {Tit:c.Tit, Tit2:c.Tit2, Img:c.Img, Img2:c.Img2, Img3:c.Img3};
		var ID = {ConInfID:c.ConInfID,ConID: $scope.container.ConID};

		recursoCrud.actualizar("ContentService.php", {dato:register,ID:ID} ).then(
			function(data) {
				$mdToast.show($mdToast.simple().textContent(data.mensaje).position('top right').hideDelay(2000));
				if(data.estado){
					recursoCrud.copiar($scope.regSel,register);
                }
			}, function(data) {
				$mdToast.show($mdToast.simple().textContent(data).position('top right').hideDelay(6000));
			}, function(data) {
				$mdToast.show($mdToast.simple().textContent(data).position('top right').hideDelay(6000));
			}
		);
	};
	$scope.deleteRegister = function (c){
		var ID = {ConInfID:c.ConInfID,ConID: $scope.container.ConID};

		recursoCrud.eliminar("ContentService.php", ID ).then(
			function(data) {
				$mdToast.show($mdToast.simple().textContent(data.mensaje).position('top right').hideDelay(2000));
				if(data.estado)
					$scope.listRegisters.splice(i,1);
			}, function(data) {
				$mdToast.show($mdToast.simple().textContent(data).position('top right').hideDelay(6000));
			}, function(data) {
				$mdToast.show($mdToast.simple().textContent(data).position('top right').hideDelay(6000));
			}
		);
	};

}]);

function DialogContainer($scope, $mdDialog,title,data) {
	$scope.title = title;
    $scope.regSel = JSON.parse(JSON.stringify(data));
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.save = function() {
        $mdDialog.hide($scope.regSel);
    };
};
