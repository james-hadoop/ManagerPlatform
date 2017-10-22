JamesBoard.controller('usersManagerCtrl', [ '$scope', 'Upload', '$timeout',
        function($scope, Upload, $timeout) {
            $("#user_table").datagrid({
                iconCls : 'icon-ok',
                width : '100%',
                height : 800,
                rownumbers : false,
                animate : true,
                collapsible : true,
                fitcolumns : true,
                singleSelect : true,
                selectOnCheck : false,
                checkOnSelect : false,
                pagination : true,
                striped : true,
                pageSize : 20,
                pageList : [ 20, 40, 60, 100, 1000 ],
                toolbar : "#toolbar",
                url : "v1/service/user/get.do",
                idField : 'hUserId',
                showFooter : false,
                columns : [ [ {
                    field : 'ck',
                    checkbox : true
                }, {
                    field : 'hUserId',
                    title : 'id',
                    width : 50,
                    align : 'left',
                    sortable : false,
                    remoteSort : false
                }, {
                    field : 'hUserPhoneNr',
                    title : '手机号码',
                    width : 150,
                    align : 'left'
                }, {
                    field : 'sUserNameStr',
                    title : '姓名',
                    width : 100,
                    align : 'left'
                }, {
                    field : 'sUserEmailStr',
                    title : 'Email',
                    width : 250,
                    align : 'left'
                }, {
                    field : 'sUserGenderCd',
                    title : '性别编码',
                    width : 100,
                    align : 'left',
                    hidden : true
                }, {
                    field : 'sUserGenderDesc',
                    title : '性别',
                    width : 50,
                    align : 'left'
                }, {
                    field : 'sUserProfileUrl',
                    title : '头像URL',
                    width : 250,
                    align : 'left'
                }, {
                    field : 'sUserActiveInd',
                    title : '是否激活',
                    width : 75,
                    align : 'left'
                }, {
                    field : 'createTsString',
                    title : '创建时间',
                    width : 100,
                    align : 'left'
                }, {
                    field : 'updateTsString',
                    title : '更新时间',
                    width : 100,
                    align : 'left'
                } ] ],
                onLoadSuccess : function(data) {
                    if ($("#job_manager_page-isButtonShow").val() == 'no') {
                        $(".job_manager_page-toolbar").css('display', 'none');
                    } else {
                        $(".custom-margin-left").css('margin-left', '20px');
                    }
                },
                onLoadError : function() {
                    // alert('结果异常!');
                    // BootstrapDialog.show({
                    // title : '错误',
                    // message : '结果异常！'
                    // });
                },
                onSelect : function(value, row, index) {
                    var hUserId = row.hUserId;
                    var hUserPhoneNr = row.hUserPhoneNr;
                    var sUserPasswordStr = row.sUserPasswordStr;
                    var sUserNameStr = row.sUserNameStr;
                    var sUserEmailStr = row.sUserEmailStr;
                    var sUserGenderCd = row.sUserGenderCd;
                    var sUserProfileUrl = row.sUserProfileUrl;
                    var sUserActiveInd = row.sUserActiveInd;

                    $('#hUserId').val(hUserId);
                    $('#hUserPhoneNr').val(hUserPhoneNr);
                    $('#sUserPasswordStr').val(sUserPasswordStr);
                    $('#sUserNameStr').val(sUserNameStr);
                    $('#sUserEmailStr').val(sUserEmailStr);
                    $('#sUserGenderCd').val(sUserGenderCd);
                    $('#sUserProfileUrl').val(sUserProfileUrl);
                    $('#sUserActiveInd').val(sUserActiveInd);
                    $('input:radio[name="sUserActiveIndRadio"]').eq(sUserActiveInd).attr("checked","checked");

                    $("#edit_user_dialog").modal('show');
                }
            });
            
            $("#search_user").bind('click', function() {
                var searchCondition=$("#search_user_condition").val();
                
                if(''==searchCondition){
                    return;
                }

                $('#user_table').datagrid('load', {
                    'searchCondition' : searchCondition
                });
            });

            $("#add_user").bind('click', function() {
                $("#add_user_dialog").modal('show');
            });

            $("#delete_user").bind('click', function() {
                var rows = $('#user_table').datagrid('getChecked');
                if (0 == rows.length) {
                    BootstrapDialog.show({
                        title : '警告',
                        message : '请选择一条记录!'
                    });
                    return;
                } else {
                    var row = rows[0];
                    var hUserId = row.hUserId;
                    var hUserPhoneNr = row.hUserPhoneNr;
                    var sUserNameStr = row.sUserNameStr;
                    var sUserEmailStr = row.sUserEmailStr;
                    var sUserGenderCd = row.sUserGenderCd;
                    var sUserProfileUrl = row.sUserProfileUrl;
                    var sUserActiveInd = row.sUserActiveInd;

                    var datas = {
                        "hUserId" : hUserId,
                        "hUserPhoneNr" : hUserPhoneNr,
                        "sUserNameStr" : sUserNameStr,
                        "sUserEmailStr" : sUserEmailStr,
                        "sUserGenderCd" : sUserGenderCd,
                        "sUserProfileUrl" : sUserProfileUrl,
                        "sUserActiveInd" : sUserActiveInd
                    };

                    ajaxRequest(datas, "delete.do");
                }
            });

            $("#add_user_dialog_save").bind('click', function() {
                var hUserPhoneNr = $('#add_hUserPhoneNr').val();
                var sUserPasswordStr = $('#add_sUserPasswordStr').val();
                var sUserNameStr = $('#add_sUserNameStr').val();
                var sUserEmailStr = $('#add_sUserEmailStr').val();
                var sUserGenderCd = $('#add_sUserGenderCd').val();
                var sUserProfileUrl = $('#add_sUserProfileUrl').val();
                var sUserActiveInd = $('input:radio[name="add_sUserActiveIndRadio"]:checked').val();

                console.info('hUserPhoneNr=' + hUserPhoneNr);
                console.info('sUserPasswordStr=' + sUserPasswordStr);
                console.info('sUserPasswordStr=' + $.md5(sUserPasswordStr));
                console.info('sUserNameStr=' + sUserNameStr);
                console.info('sUserEmailStr=' + sUserEmailStr);
                console.info('sUserGenderCd=' + sUserGenderCd);
                console.info('sUserProfileUrl=' + sUserProfileUrl);
                console.info('sUserActiveInd=' + sUserActiveInd);

                var datas = {
                    "hUserPhoneNr" : hUserPhoneNr,
                    "sUserPasswordStr":$.md5(sUserPasswordStr),
                    "sUserNameStr" : sUserNameStr,
                    "sUserEmailStr" : sUserEmailStr,
                    "sUserGenderCd" : sUserGenderCd,
                    "sUserProfileUrl" : sUserProfileUrl,
                    "sUserActiveInd" : sUserActiveInd
                };

                ajaxRequest(datas, "add.do");
            });

            $("#edit_user_dialog_save").bind('click', function() {
                var hUserId = $('#hUserId').val();
                var sUserPasswordStr = $('#sUserPasswordStr').val();
                var hUserPhoneNr = $('#hUserPhoneNr').val();
                var sUserNameStr = $('#sUserNameStr').val();
                var sUserEmailStr = $('#sUserEmailStr').val();
                var sUserGenderCd = $('#sUserGenderCd').val();
                var sUserProfileUrl = $('#sUserProfileUrl').val();
                var sUserActiveInd = $('input:radio[name="sUserActiveIndRadio"]:checked').val()

                console.info('hUserId=' + hUserId);
                console.info('hUserPhoneNr=' + hUserPhoneNr);
                console.info('sUserPasswordStr=' + sUserPasswordStr);
                console.info('sUserPasswordStr=' + $.md5(sUserPasswordStr));
                console.info('sUserNameStr=' + sUserNameStr);
                console.info('sUserEmailStr=' + sUserEmailStr);
                console.info('sUserGenderCd=' + sUserGenderCd);
                console.info('sUserProfileUrl=' + sUserProfileUrl);
                console.info('sUserActiveInd=' + sUserActiveInd);

                var datas = {
                    "hUserId" : hUserId,
                    "hUserPhoneNr" : hUserPhoneNr,
                    "sUserPasswordStr":$.md5(sUserPasswordStr),
                    "sUserNameStr" : sUserNameStr,
                    "sUserEmailStr" : sUserEmailStr,
                    "sUserGenderCd" : sUserGenderCd,
                    "sUserProfileUrl" : sUserProfileUrl,
                    "sUserActiveInd" : sUserActiveInd
                };

                ajaxRequest(datas, "edit.do");
            });

            ajaxRequest = function(datas, oper) {
                $.ajax({
                    type : "POST",
                    url : "v1/service/user/" + oper,
                    data : JSON.stringify(datas),
                    contentType : "application/json",
                    dataType : "json",
                    success : function(data) {
                        if (data != null) {
                            console.info(data);

                            if (data.responseResult == "SUCCESS") {
                                BootstrapDialog.show({
                                    title : '结果',
                                    message : '操作成功!'
                                });

                                window.location.reload();
                            } else {
                                BootstrapDialog.show({
                                    title : '结果',
                                    message : '操作失败！'
                                });
                            }
                        }
                    },
                    error : function(data) {
                        BootstrapDialog.show({
                            title : '结果',
                            message : '后台请求失败！'
                        });
                    }
                });
            };
        } ]);