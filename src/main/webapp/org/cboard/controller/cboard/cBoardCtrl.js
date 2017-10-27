/**
 * Created by yfyuan on 2016/7/19.
 */
JamesBoard.controller('JamesBoard', function ($scope, $location, $http, $q, $filter, $uibModal, ModalUtils) {

    var translate = $filter('translate');

    $http.get("commons/getUserDetail.do").success(function (response) {
        $scope.user = response;
        var avatarUrl = 'dist/img/user-male-circle-blue-128.png';
        $scope.user.avatar = avatarUrl;
    });

    var getMenuList = function () {
        $http.get("commons/getMenuList.do").success(function (response) {
            $scope.menuList = response;
        });
    };

    $scope.isShowMenu = function (code) {
        return !_.isUndefined(_.find($scope.menuList, function (menu) {            
            return menu.menuCode == code;
        }));
    };

    getMenuList();

    $scope.changePwd = function () {
        $uibModal.open({
            templateUrl: 'org/cboard/view/cboard/changePwd.html',
            windowTemplateUrl: 'org/cboard/view/util/modal/window.html',
            backdrop: false,
            size: 'sm',
            controller: function ($scope, $uibModalInstance) {
                $scope.close = function () {
                    $uibModalInstance.close();
                };
                $scope.ok = function () {
                    $http.post("commons/changePwd.do", {
                        curPwd: $scope.curPwd,
                        newPwd: $scope.newPwd,
                        cfmPwd: $scope.cfmPwd
                    }).success(function (serviceStatus) {
                        if (serviceStatus.status == '1') {
                            ModalUtils.alert(translate("COMMON.SUCCESS"), "modal-success", "sm");
                            $uibModalInstance.close();
                        } else {
                            ModalUtils.alert(serviceStatus.msg, "modal-warning", "lg");
                        }
                    });
                };
            }
        })
        ;
    }
});