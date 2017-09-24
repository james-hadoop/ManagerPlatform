JamesBoard.controller('contentsManagerCtrl', [ '$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {
    $("#job_manager_table").datagrid({
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
        pageList : [ 20, 40, 60, 100, 1000 ],
        toolbar : "#toolbar",
        url : "data/getTEventSummaryByType.json",
        idField : 'hEventId',
        showFooter : false,
        columns : [ [ {
            field : 'ck',
            checkbox : true
        }, {
            field : 'hEventId',
            title : 'id',
            width : 100,
            align : 'left',
            sortable : false,
            remoteSort : false
        }, {
            field : 'sEventTitleUrl',
            title : '显示URL',
            width : 100,
            align : 'left'
        }, {
            field : 'sEventContentUrl',
            title : '跳转URL',
            width : 330,
            align : 'left'
        }, {
            field : 'rEventCategoryDesc',
            title : '类别',
            width : 100,
            align : 'left'
        }, {
            field : 'rEventTypeDesc',
            title : '类型',
            width : 100,
            align : 'left'
        }, {
            field : 'sEventActiveInd',
            title : '是否激活',
            width : 100,
            align : 'left'
        }, {
            field : 'createTs',
            title : '创建时间',
            width : 150,
            align : 'left'
        }, {
            field : 'updateTs',
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
            alert('结果异常!');
            // BootstrapDialog.show({
            // title : '错误',
            // message : '结果异常！'
            // });
        },
        onSelect : function(value, row, index) {
            var eventId = row.hEventId;
            var eventTitleUrl = row.sEventTitleUrl;
            var eventContentUrl = row.sEventContentUrl;
            
            $('#eventTitleUrl').val(eventTitleUrl);
            $('#eventContentUrl').val(eventContentUrl);

            $("#edit_event_dialog").modal('show');
        }
    });

    $("#addEvent").bind('click', function() {
        $("#add_event_dialog").modal('show');
    });
    
    $("#deleteEvent").bind('click', function() {
        alert('delete');
    });

} ]);