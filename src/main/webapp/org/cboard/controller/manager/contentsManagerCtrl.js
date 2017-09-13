JamesBoard.controller('contentsManagerCtrl', [ '$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {
    $("#job_manager_table").datagrid({
        iconCls : 'icon-ok',
        width : '100%',
        height : 600,
        rownumbers : true,
        animate : true,
        collapsible : true,
        fitcolumns : true,
        singleSelect : true,
        selectOnCheck : false,
        checkOnSelect : false,
        pagination : true,
        striped : true,
        pageList : [ 20, 40, 60, 100, 1000 ],
        toolbar : "#toolbar",
        url : "job/manager/loadAllNew",
        idField : 'name',
        showFooter : false,
        columns : [ [ {
            field : 'ck',
            checkbox : true
        }, {
            field : 'id',
            title : 'id',
            width : 100,
            align : 'left',
            sortable : false,
            remoteSort : false,
            hidden : true
        }, {
            field : 'jobType',
            title : '任务类型',
            width : 100,
            align : 'left',
            hidden : true
        }, {
            field : 'name',
            title : '名称',
            width : 400,
            align : 'left'
        }, {
            field : 'description',
            title : '描述',
            width : 600,
            align : 'left'
        }, {
            field : 'strJobType',
            title : '类型',
            width : 100,
            align : 'left'
        }, {
            field : 'strUpdateTime',
            title : '上次修改',
            width : 300,
            align : 'left'
        }, {
            field : 'createUserName',
            title : '创建人',
            width : 250,
            align : 'left'
        }, {
            field : 'mysqlPrimaryKeys',
            title : 'mysqlPrimaryKeys',
            width : 250,
            align : 'left',
            hidden : true
        } ] ],
        onLoadSuccess : function(data) {
            if ($("#job_manager_page-isButtonShow").val() == 'no') {
                $(".job_manager_page-toolbar").css('display', 'none');
            } else {
                $(".custom-margin-left").css('margin-left', '20px');
            }
        },
        onLoadError : function() {
            BootstrapDialog.show({
                title : '错误',
                message : '结果异常！'
            });
        }
    });
} ]);