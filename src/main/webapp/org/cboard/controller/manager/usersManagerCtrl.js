JamesBoard.controller('usersManagerCtrl', [ '$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {
    $("#event_table").datagrid({
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
        pagination : false,
        striped : true,
        pageList : [ 20, 40, 60, 100, 1000 ],
        toolbar : "#toolbar",
        // url : "data/getTEventSummaryByType.json",
        url : "v1/service/event/postTEventSummaryByCondition.do",
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
            field : 'sEventCategoryCd',
            title : '类别编码',
            width : 100,
            align : 'left',
            hidden : true
        }, {
            field : 'sEventTypeCd',
            title : '类型编码',
            width : 100,
            align : 'left',
            hidden : true
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
            // alert('结果异常!');
            // BootstrapDialog.show({
            // title : '错误',
            // message : '结果异常！'
            // });
        },
        onSelect : function(value, row, index) {
            var eventId = row.hEventId;
            var eventTitleUrl = row.sEventTitleUrl;
            var eventContentUrl = row.sEventContentUrl;
            var eventCategory = row.sEventCategoryCd;
            var eventType = row.sEventTypeCd;
            var eventSubContentString = row.eventSubContentString;
            var eventBannerPosition=row.sEventBannerPositionCd;
            var eventRecomPosition=row.sEventRecomPositionCd;
            
            console.info(eventSubContent);

            $('#edit_event_id').val(eventId);
            $('#edit_event_title_url').val(eventTitleUrl);
            $('#edit_event_content_url').val(eventContentUrl);
            $('#edit_event_category').val(eventCategory);
            $('#edit_event_type').val(eventType);
            $('#edit_event_sub_content').val(eventSubContentString);
            $('#edit_event_banner_position').val(eventBannerPosition);
            $('#edit_event_recomend_position').val(eventRecomPosition);

            $("#edit_event_dialog").modal('show');
        }
    });

    $("#add_event").bind('click', function() {
        $("#add_event_dialog").modal('show');
    });

    $("#delete_event").bind('click', function() {
        var rows = $('#event_table').datagrid('getChecked');
        var row = rows[0];

        if (0 == rows.length) {
            alert('请选择一个Job!');
            return;
        } else {
            var eventId = row.hEventId;
            var eventTitleUrl = row.sEventTitleUrl;
            var eventContentUrl = row.sEventContentUrl;
            var eventCategory = row.rEventCategoryCd;
            var eventType = row.sEventTypeCd;
            var eventBannerPosition = row.sEventBannerPositionCd;
            var eventRecommendPosition = row.sEventRecomPositionCd;

            datas = {
                "hEventId" : eventId,
                "sEventCategoryCd" : eventCategory,
                "sEventTypeCd" : eventType,
                "sEventTitleUrl" : eventTitleUrl,
                "sEventContentUrl" : eventContentUrl,
                "sEventBannerPositionCd" : eventBannerPosition,
                "sEventRecomPositionCd" : eventRecommendPosition
            };

            ajaxRequest(datas, "deleteTEventSummary.do");
        }
    });

    $("#add_event_dialog_save").bind('click', function() {
        var addEventName = $("#add_event_name").val();
        var addEventCategory = $("#add_event_category").val();
        var addEventType = $("#add_event_type").val();
        var addEventTitleUrl = $("#add_event_title_url").val();
        var addEventContentUrl = $("#add_event_content_url").val();
        var addEventIsActive = $('input:radio[name="add_event_is_active"]:checked').val();
        var addEventIsBanner = $('input:radio[name="add_event_is_banner"]:checked').val();
        var addEventBannerPosition = $("#add_event_banner_position").val();
        var addEventIsRecommend = $('input:radio[name="add_event_is_recommend"]:checked').val();
        var addEventRecommendPosition = $("#add_event_recommend_position").val();
        var addEventSubContent=$("#add_event_sub_content").val();
        //var sEventSubContent

        console.info('addEventName=' + addEventName);
        console.info('addEventCategory=' + addEventCategory);
        console.info('addEventType=' + addEventType);
        console.info('addEventTitleUrl=' + addEventTitleUrl);
        console.info('addEventContentUrl=' + addEventContentUrl);
        console.info('addEventIsActive=' + addEventIsActive);
        console.info('addEventIsBanner=' + addEventIsBanner);
        console.info('addEventBannerPosition=' + addEventBannerPosition);
        console.info('addEventIsRecommend=' + addEventIsRecommend);
        console.info('addEventRecommendPosition=' + addEventRecommendPosition);
        console.info('addEventSubContent=' + addEventSubContent);

        var datas = {
            "sEventCategoryCd" : addEventCategory,
            "sEventTypeCd" : addEventType,
            "sEventTitleUrl" : addEventTitleUrl,
            "sEventContentUrl" : addEventContentUrl,
            "sEventActiveInd" : addEventIsActive,
            "sEventTypeCd" : addEventType,
            "sEventBannerPositionCd" : addEventBannerPosition,
            "sEventRecomPositionCd" : addEventRecommendPosition,
            "sEventSubContent":addEventSubContent
        };

        ajaxRequest(datas, "addTEventSummary.do");
    });

    $("#edit_event_dialog_save").bind('click', function() {
        var editEventId = $("#edit_event_id").val();
        var editEventName = $("#edit_event_name").val();
        var editEventCategory = $("#edit_event_category").val();
        var editEventType = $("#edit_event_type").val();
        var editEventTitleUrl = $("#edit_event_title_url").val();
        var editEventContentUrl = $("#edit_event_content_url").val();
        var editEventIsActive = $('input:radio[name="edit_event_is_active"]:checked').val();
        var editEventIsBanner = $('input:radio[name="edit_event_is_banner"]:checked').val();
        var editEventBannerPosition = $("#edit_event_banner_position").val();
        var editEventIsRecommend = $('input:radio[name="edit_event_is_recommend"]:checked').val();
        var editEventRecommendPosition = $("#edit_event_recommend_position").val();
        var editEventSubContent=$("#edit_event_sub_content").val();

//        console.info('editEventId=' + editEventId);
//        console.info('editEventName=' + editEventName);
//        console.info('editEventCategory=' + editEventCategory);
//        console.info('editEventType=' + editEventType);
//        console.info('editEventTitleUrl=' + editEventTitleUrl);
//        console.info('editEventContentUrl=' + editEventContentUrl);
//        console.info('editEventIsActive=' + editEventIsActive);
//        console.info('editEventIsBanner=' + editEventIsBanner);
//        console.info('editEventBannerPosition=' + editEventBannerPosition);
//        console.info('editEventIsRecommend=' + editEventIsRecommend);
//        console.info('editEventRecommendPosition=' + editEventRecommendPosition);

        var datas = {
            "hEventId" : editEventId,
            "sEventCategoryCd" : editEventCategory,
            "sEventTypeCd" : editEventType,
            "sEventTitleUrl" : editEventTitleUrl,
            "sEventContentUrl" : editEventContentUrl,
            "sEventActiveInd" : editEventIsActive,
            "sEventTypeCd" : editEventType,
            "sEventBannerPositionCd" : editEventBannerPosition,
            "sEventRecomPositionCd" : editEventRecommendPosition,
            "sEventSubContent":editEventSubContent
        };

        ajaxRequest(datas, "editTEventSummary.do");
    });

    ajaxRequest = function(datas, oper) {
        $.ajax({
            type : "POST",
            url : "v1/service/event/" + oper,
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