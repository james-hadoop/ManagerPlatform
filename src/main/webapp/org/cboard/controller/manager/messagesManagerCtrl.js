JamesBoard.controller('messagesManagerCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $("#message_table").datagrid({
        iconCls : 'icon-ok',
        width : '100%',
        height : 800,
        rownumbers : true,
        animate : true,
        collapsible : true,
        fitcolumns : true,
        singleSelect : true,
        selectOnCheck : false,
        checkOnSelect : false,
        pagination : true,
        striped : true,
        pageSize: 20,
        pageList : [ 20, 40, 60, 100, 1000 ],
        toolbar : "#toolbar",
        url : "v1/service/message/get.do",
        idField : 'hMessageId',
        showFooter : false,
        columns : [ [ {
            field : 'ck',
            checkbox : true
        }, {
            field : 'hMessageId',
            title : 'id',
            width : 100,
            align : 'left',
            sortable : false,
            remoteSort : false
        }, {
            field : 'sMessageCategoryCd',
            title : '消息类别编码',
            width : 100,
            align : 'left',
            hidden:true
        },{
            field : 'sMessageCategoryDesc',
            title : '消息类别',
            width : 100,
            align : 'left'
        }, {
            field : 'sMessageContentStr',
            title : '消息内容',
            width : 495,
            align : 'left'
        },{
            field : 'sMessageActiveInd',
            title : '是否激活',
            width : 100,
            align : 'left'
        }, {
            field : 'createTsString',
            title : '创建时间',
            width : 150,
            align : 'left'
        }, {
            field : 'updateTsString',
            title : '更新时间',
            width : 150,
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
            var hMessageId = row.hMessageId;
            var sMessageActiveInd = row.sMessageActiveInd;
            var sMessageCategoryCd = row.sMessageCategoryCd;
            var sMessageCategoryDesc = row.sMessageCategoryDesc;
            var sMessageContentStr = row.sMessageContentStr;

            $('#hMessageId').val(hMessageId);
            $('#sMessageActiveInd').val(sMessageActiveInd);
            $('#sMessageCategoryCd').val(sMessageCategoryCd);
            $('#sMessageCategoryDesc').val(sMessageCategoryDesc);
            $('#sMessageContentStr').val(sMessageContentStr);
            $('input:radio[name="sMessageActiveIndRadio"]').eq(sMessageActiveInd).attr("checked","checked");

            $("#edit_message_dialog").modal('show');
        }
    });

    $("#add_message").bind('click', function() {
        $("#add_message_dialog").modal('show');
    });

    $("#delete_message").bind('click', function() {
        var rows = $('#message_table').datagrid('getChecked');

        if (0 == rows.length) {
            BootstrapDialog.show({
                title : '警告',
                message : '请选择一条记录!'
            });
            return;
        } else {
            var row = rows[0];
            
            var hMessageId = row.hMessageId;
            var sMessageActiveInd = row.sMessageActiveInd;
            var sMessageCategoryCd = row.sMessageCategoryCd;
            var sMessageContentStr = row.sMessageContentStr;
            
            console.info('hMessageId=' + hMessageId);
            console.info('sMessageCategoryCd=' + sMessageCategoryCd);
            console.info('sMessageContentStr=' + sMessageContentStr);
            console.info('sMessageActiveInd=' + sMessageActiveInd);

            datas = {
                "hMessageId" : hMessageId,
                "sMessageActiveInd" : sMessageActiveInd,
                "sMessageCategoryCd" : sMessageCategoryCd,
                "sMessageContentStr" : sMessageContentStr
            };

            ajaxRequest(datas, "delete.do");
        }
    });
    
    $('#associate_message_dialog_save').bind('click', function() {
        var rows = $("#associate_user_table").bootstrapTable('getSelections');
        
        if (0 == rows.length) {
            BootstrapDialog.show({
                title : '警告',
                message : '请选择一条记录!'
            });
            return;
        } else {
            var hUserIds = new Array();
            for (var i = 0; i < rows.length; i++) {
                hUserIds[i] = rows[i].hUserId;
            }
            
            console.info(hUserIds);
            var hMessageId=$('#associate_message_id').val();
            console.info(hMessageId);
            
            datas = {
                    "hMessageId" : hMessageId,
                    "hUserIds" : hUserIds
                };

            ajaxRequest(datas, "associate.do");
        }
    });
    
    $("#associate_message").bind('click', function() {
        var rows = $('#message_table').datagrid('getChecked');
        var row = rows[0];

        if (1 != rows.length) {
            BootstrapDialog.show({
                title : '警告',
                message : '请选择一条记录!'
            });
            return;
        } else {
            var hMessageId = row.hMessageId;
            $('#associate_message_id').val(hMessageId);
            
            $("#associate_user_table").bootstrapTable('destroy');
            $("#associate_user_table").bootstrapTable({
                title : '关联用户',
                iconCls : 'icon-ok',
                width : 600,
                method : 'post',
                height : 300,
                cache : false,
                rownumbers : false,
                animate : false,
                collapsible : false,
                fitcolumns : false,
                singleSelect : false,
                striped : true,
                pagination : true,
                pageNumber : 1,
                pageSize : 10,
                pageList : [ 10, 20, 50, 100, 1000 ],
                url : 'v1/service/user/get.do',
                idField : 'hUserId',
                clickToSelect : false,
                queryParams : function(params) {
                    var temp = {
                        rows : params.limit,
                        page : params.offset
                    };
                    return temp;
                },
                showFooter : false,
                sidePagination : "server",
                columns : [ [ {
                    field : 'ck',
                    width : 50,
                    field : 'state',
                    checkbox : true,
                    //formatter : authorizationFunction.initStateFormatter
                }, {
                    field : 'hUserId',
                    title : 'id',
                    width : 50,
                    align : 'left',
                    sortable : true,
                    remoteSort : false
                }, {
                    field : 'sUserNameStr',
                    title : '姓名',
                    width : 300,
                    align : 'left'
                }, {
                        field : 'hUserPhoneNr',
                        title : '手机号码',
                    width : 235,
                    align : 'left'
                } ] ],
                onLoadError : function() {
                    BootstrapDialog.show({
                        title : 'Error',
                        message : 'associate_user_table Error'
                    });
                }
            });

            $("#associate_message_dialog").modal('show');
        }
    });

    $("#add_message_dialog_save").bind('click', function() {
        var sMessageCategoryCd = $("#add_sMessageCategoryCd").val();
        var sMessageContentStr = $("#add_sMessageContentStr").val();
        var sMessageActiveInd = $('input:radio[name="add_sMessageActiveIndRadio"]:checked').val();

        console.info('sMessageCategoryCd=' + sMessageCategoryCd);
        console.info('sMessageContentStr=' + sMessageContentStr);
        console.info('sMessageActiveInd=' + sMessageActiveInd);

        datas = {
                "sMessageActiveInd" : sMessageActiveInd,
                "sMessageCategoryCd" : sMessageCategoryCd,
                "sMessageContentStr" : sMessageContentStr
            };

        ajaxRequest(datas, "add.do");
    });

    $("#edit_message_dialog_save").bind('click', function() {
        var hMessageId=$("#hMessageId").val();
        var sMessageCategoryCd = $("#sMessageCategoryCd").val();
        var sMessageContentStr = $("#sMessageContentStr").val();
        var sMessageActiveInd = $('input:radio[name="sMessageActiveIndRadio"]:checked').val();
        
        console.info('hMessageId=' + hMessageId);
        console.info('sMessageCategoryCd=' + sMessageCategoryCd);
        console.info('sMessageContentStr=' + sMessageContentStr);
        console.info('sMessageActiveInd=' + sMessageActiveInd);

        datas = {
                "hMessageId" : hMessageId,
                "sMessageActiveInd" : sMessageActiveInd,
                "sMessageCategoryCd" : sMessageCategoryCd,
                "sMessageContentStr" : sMessageContentStr
            };

        ajaxRequest(datas, "edit.do");
    });

    ajaxRequest = function(datas, oper) {
        $.ajax({
            type : "POST",
            url : "v1/service/message/" + oper,
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
}]);