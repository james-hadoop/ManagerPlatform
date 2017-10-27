JamesBoard.controller('resourcesManagerCtrl', [
        '$scope',
        'Upload',
        '$timeout',

        function($scope, Upload, $timeout) {
            $scope.types = [ {
                type : "audio"
            }, {
                type : "video"
            }, {
                type : "image"
            } ];

            $scope.uploadResource = function(file) {
                file.upload = Upload.upload({
                    // url:
                    // 'http://localhost:8088/v1/service/user/uploadResource',
                    url : 'resourceManager/uploadResource.do',
                    data : {
                        targetDir : $scope.selectedType,
                        file : file
                    },
                });

                file.upload.then(function(response) {
                    $timeout(function() {
                        file.result = response.data;
                        console.info(response);
                    });
                }, function(response) {
                    console.info(response);
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': '
                                + response.data;
                }, function(evt) {
                    console.info(evt);
                    // Math.min is to fix IE which reports 200% sometimes
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded
                            / evt.total));
                });
            }
        } ]);