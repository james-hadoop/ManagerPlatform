$(function() {
    var srcDatabaseType;
    var dstDatabaseType;

    var srcDbId;
    var dstDbId;

    //jobManager.init();

    jobManager.bind();

    jobManager.initCombobox();

    $(document).on('click', '#param_kv_remove', function() {
        $(this).parent().parent().remove();
    });

    $(document).on('click', '#edit_param_kv_remove', function() {
        $(this).parent().parent().remove();
    });

    $(document).on('click', '.tag', function() {
        var id = $(this).attr('id');
        var interActionid = id.split('-')[1];

        $("#" + interActionid + ">span").each(function() {
            $(this).removeClass('label');
            $(this).removeClass('label-danger');
        });

        $(this).remove();

        // dynamic search
        var filterCondition;
        var searchCondition = $("#seach_condition").val();

        $("#section_condition_filter>span").each(function() {
            var id = $(this).attr('id');
            var group = id.split('-')[1];
            var grossValue = $(this).html();
            var netValue = grossValue.split('&nbsp;&nbsp;')[1];

            if (-1 != id.indexOf("type")) {
                filterCondition = netValue;
            }
        });

        $('#job_manager_table').datagrid('load', {
            'search_condition' : searchCondition,
            'filter_condition' : filterCondition
        });
    });

    $('#create_job_java_dialog').on('hidden.bs.modal', function(e) {
        paramJarUpload.reset();
    });

    $('#edit_job_java_dialog').on('hidden.bs.modal', function(e) {
        editParamJarUpload.reset();

        $("tr[id*='edit_param_row']").remove();
        $("#edit_param_key_header").val('');
        $("#edit_param_key_header").val('');

        $("tr[id*='edit_param_row']").remove();
    });

    $('#create_job_data_sync_dialog').on('hidden.bs.modal', function(e) {
        $("tr[id*='param_job_src_table_tr-']").remove();
        $("tr[id*='param_job_dst_table_tr-']").remove();
        fieldRowNumberSrc = 1;
        fieldRowNumberDst = 1;
    });
});

var paramJarUpload;
var editParamJarUpload

var paramShellUpload;
var editParamShellUpload;

var jobName = '';
var formatData = '';

var url;
var fieldRowNumberSrc = 1;
var fieldRowNumberDst = 1;

var jobManager = {
    init : function() {
        $("#job_manager_table")
                .datagrid(
                        {
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
                            },
                            onSelect : function(value, row, index) {
                                var jobType = row.jobType;
                                if (jobType == 3) {
                                    $.getJSON("code_in_use/getOneCodeFilename", "task_id=" + row.id, function(json) {
                                        $("#edit_param_id-hive").val(row.id);
                                        $("#edit_param_name-hive").val(row.name);
                                        $("#edit_param_desc-hive").val(row.description);
                                        $("#edit_hiveSql").val(row.description);
                                        // 添加默认文件名
                                        $('#edit_excute_filename').combobox('select', json.fileName);
                                        $("#edit_job_hive_dialog").modal('show');
                                    });
                                }
                                if (jobType == 1) {
                                    $("#edit_param_id-java").val(row.id);
                                    $("#edit_param_name-java").val(row.name);
                                    $("#edit_param_desc-java").val(row.description);
                                    $("#edit_param_java_main_class").val(row.jarClassFullName);
                                    $("#edit_param_run_memory").val(row.javaEnv);

                                    if (typeof (row.taskParameters) != 'undefined') {
                                        var strJobParameter = row.taskParameters;
                                        var objJobParameter = JSON.stringify(strJobParameter);

                                        var kvs = row.taskParameters.split("|");

                                        var k1 = '';
                                        var k2 = '';
                                        var bFirstKv = false;
                                        kvs
                                                .forEach(function(kv) {
                                                    k = kv.split(':')[0];
                                                    v = kv.substring(kv.indexOf(':') + 1);

                                                    if (bFirstKv == false) {
                                                        $("#edit_param_key_header").val(k);
                                                        $("#edit_param_value_header").val(v);
                                                        bFirstKv = true;
                                                    } else {
                                                        var htmlString = "<tr id=\"edit_param_row\"><td><label id=\"edit_param_kv_add\" class=\"margin-left-50 width-40 custom_hover\" class=\"margin-left-50 custom_hover\"></label></td><td class=\"width-space\"></td><td><input type=\"text\" class=\"width-200 custom-input\" id=\"edit_param_key\" placeholder=\"\" value=\""
                                                                + k
                                                                + "\"></td><td class=\"width-space\"></td><td><input type=\"text\" class=\"width-200 custom-input\" id=\"edit_param_value\" placeholder=\"\" value=\""
                                                                + v
                                                                + "\"></td><td class=\"width-space\"></td><td><input id=\"edit_param_kv_remove\" class=\"custom-delete-img-button\" type=\"image\" src=\"css/images/remove.png\" /></td></tr>";

                                                        $("#edit_param_kv_add").parent().parent().after(htmlString);
                                                    }
                                                });
                                    }

                                    $("#edit_job_java_dialog").modal('show');
                                }
                                if (jobType == 2) {
                                    $("#edit_param_id-shell").val(row.id);
                                    $("#edit_param_name-shell").val(row.name);
                                    $("#edit_param_desc-shell").val(row.description);
                                    $("#edit_param_command-shell").val(row.taskParameters);

                                    $("#edit_job_shell_dialog").modal('show');
                                }
                                if (jobType == 4) {
                                    $("#create_job_data_sync_dialog_title").html('编辑同步Job');

                                    $("#param_name-data").val(row.name);
                                    $("#param_description-data").val(row.description);
                                    $("#param_run_memory-data").val(row.javaEnv);

                                    var srcTableFields;
                                    var dstTableFields;

                                    switch (row.syncType) {
                                    case 1:
                                        srcDatabaseType = 2;
                                        dstDatabaseType = 1;

                                        $("#param_mysql_primary_key-data-form").css('display', 'block');
                                        $("#param_mysql_primary_key-data").val(row.mysqlPrimaryKeys);

                                        break;
                                    case 2:
                                        srcDatabaseType = 1;
                                        dstDatabaseType = 2;

                                        $("#param_mysql_primary_key-data-form").css('display', 'none');
                                        break;
                                    case 3:
                                        srcDatabaseType = 1;
                                        dstDatabaseType = 3;

                                        $("#param_mysql_primary_key-data-form").css('display', 'none');
                                        break;
                                    }

                                    $("#param_src_database_type-data").val(srcDatabaseType);
                                    $("#param_dst_database_type-data").val(dstDatabaseType);

                                    switch (srcDatabaseType) {
                                    case 1:
                                        comboboxManager.enableComboboxDatabaseName('param_src_database_name-data', srcDatabaseType);
                                        $("#param_src_database_name-data").combobox('setValue', row.hiveDbId);
                                        $("#param_src_database_name-data").combobox('setText', row.hiveDbName);

                                        var urlTable = "hiveDataTable/getByDb?db_id=" + row.hiveDbId;
                                        $("#param_src_table_name-data").combobox('reload', urlTable);
                                        $("#param_src_table_name-data").combobox('setValue', row.hiveTableName);
                                        $("#param_src_partition").val(row.hiveTablePartition);
                                        $("#param_src_condition").val(row.hiveTableCondition);

                                        srcTableFields = row.hiveTableFields;
                                        break;
                                    case 2:
                                        comboboxManager.enableComboboxDatabaseName('param_src_database_name-data', srcDatabaseType);
                                        $("#param_src_database_name-data").combobox('setValue', row.mysqlDbId);
                                        $("#param_src_database_name-data").combobox('setText', row.mysqlDbName);

                                        var urlTable = "data_mysql_table/getByDb?db_id=" + row.mysqlDbId;
                                        $("#param_src_table_name-data").combobox('reload', urlTable);
                                        $("#param_src_table_name-data").combobox('setValue', row.mysqlTableName);
                                        $("#param_src_partition").val(row.mysqlTablePartition);
                                        $("#param_src_condition").val(row.mysqlTableCondition);

                                        srcTableFields = row.mysqlTableFields;
                                        break;
                                    }

                                    switch (dstDatabaseType) {
                                    case 1:
                                        comboboxManager.enableComboboxDatabaseName('param_dst_database_name-data', dstDatabaseType);
                                        $("#param_dst_database_name-data").combobox('setValue', row.hiveDbId);
                                        $("#param_dst_database_name-data").combobox('setText', row.hiveDbName);

                                        var urlTable = "hiveDataTable/getByDb?db_id=" + row.hiveDbId;
                                        $("#param_dst_table_name-data").combobox('reload', urlTable);
                                        $("#param_dst_table_name-data").combobox('setValue', row.hiveTableName);
                                        $("#param_dst_partition").val(row.hiveTablePartition);

                                        dstTableFields = row.hiveTableFields;
                                        break;
                                    case 2:
                                        comboboxManager.enableComboboxDatabaseName('param_dst_database_name-data', dstDatabaseType);
                                        $("#param_dst_database_name-data").combobox('setValue', row.mysqlDbId);
                                        $("#param_dst_database_name-data").combobox('setText', row.mysqlDbName);

                                        var urlTable = "data_mysql_table/getByDb?db_id=" + row.mysqlDbId;
                                        $("#param_dst_table_name-data").combobox('reload', urlTable);
                                        $("#param_dst_table_name-data").combobox('setValue', row.mysqlTableName);
                                        $("#param_dst_partition").val(row.mysqlTablePartition);

                                        dstTableFields = row.mysqlTableFields;

                                        break;
                                    case 3:
                                        comboboxManager.enableComboboxDatabaseName('param_dst_database_name-data', dstDatabaseType);
                                        $("#param_dst_database_name-data").combobox('setValue', row.verticaDbId);
                                        $("#param_dst_database_name-data").combobox('setText', row.verticaDbName);

                                        var urlSchema = "data_vertica_schema/getByDb?db_id=" + row.verticaDbId;
                                        $("#param_dst_schema_name-data").combobox('reload', urlSchema);
                                        $("#param_dst_schema_name-data").combobox('setValue', row.verticaSchemaName);
                                        $("#param_dst_schema_name-data").combobox('setText', row.verticaSchemaName);

                                        var urlTable = "data_vertica_table/getBySchema?db_id=" + row.verticaDbId + "&schema_name=" + row.verticaSchemaName;
                                        $("#param_src_table_name-data").combobox('reload', url);
                                        $("#param_dst_table_name-data").combobox('setValue', row.verticaTableName);
                                        $("#param_dst_partition").val(row.verticaTablePartition);

                                        dstTableFields = row.verticaTableFields;
                                        break;
                                    }

                                    $("tr[id*='param_job_src_table']").remove();
                                    $("tr[id*='param_job_dst_table']").remove();

                                    var kvsSrc = srcTableFields.split("|");
                                    kvsSrc.forEach(function(kv) {
                                        k = kv.split(':')[0];
                                        v = kv.split(':')[1];

                                        var htmlStringSrc = "<tr id=\"param_job_src_table_tr-" + fieldRowNumberSrc + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                                + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_src_column_id-data\" value=\"" + fieldRowNumberSrc + "\"></td>"
                                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_name-data\" value=\"" + k + "\"></td>"
                                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_type-data\" value=\"" + v + "\"></td>"
                                                + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_src_table_tr-" + fieldRowNumberSrc
                                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_src_table_tr-" + fieldRowNumberSrc
                                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_src_table_tr-" + fieldRowNumberSrc
                                                + "')\"></a></td>" + "</tr>";

                                        $("#job_src_table").append(htmlStringSrc);
                                        fieldRowNumberSrc++;
                                    });

                                    var kvsDst = dstTableFields.split("|");
                                    kvsDst.forEach(function(kv) {
                                        k = kv.split(':')[0];
                                        v = kv.split(':')[1];

                                        var htmlStringDst = "<tr id=\"param_job_dst_table_tr-" + fieldRowNumberDst + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                                + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_dst_column_id-data\" value=\"" + fieldRowNumberDst + "\"></td>"
                                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_name-data\" value=\"" + k + "\"></td>"
                                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_type-data\" value=\"" + v + "\"></td>"
                                                + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_dst_table_tr-" + fieldRowNumberDst
                                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_dst_table_tr-" + fieldRowNumberDst
                                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_dst_table_tr-" + fieldRowNumberDst
                                                + "')\"></a></td></td>" + "</tr>";

                                        $("#job_dst_table").append(htmlStringDst);
                                        fieldRowNumberDst++;
                                    });

                                    $("#create_job_data_sync_dialog").modal('show');
                                }
                            }
                        });

        $("#section_condition>div>span").each(function() {
            $(this).addClass('custom_hover');
        });

        paramJarUpload = $("#param_jar_upload").uploadFile({
            url : "job/manager/uploadFiles",
            multiple : true,
            autoSubmit : false,
            dragDrop : false,
            onSuccess : function(files, data, xhr, pd) {
                var returnMessage = data.returnFlag;
                if (returnMessage == 'exists') {
                    paramJarUpload.cancelAll();
                }
            },
            onCancel : function(files, pd) {
                BootstrapDialog.show({
                    title : '警告',
                    message : '该Job名称已经存在，请选择其它Job名称重试!'
                });
            }
        });

        editParamJarUpload = $("#edit_param_jar_upload").uploadFile({
            url : "job/manager/uploadFiles",
            multiple : true,
            autoSubmit : false,
            dragDrop : false
        });

        paramShellUpload = $("#param_shell_upload").uploadFile({
            url : "job/manager/uploadFiles",
            multiple : false,
            autoSubmit : false,
            dragDrop : false,
            onSuccess : function(files, data, xhr, pd) {
                var returnMessage = data.returnFlag;
                if (returnMessage == 'exists') {
                    paramJarUpload.cancelAll();
                }
            },
            onCancel : function(files, pd) {
                BootstrapDialog.show({
                    title : '警告',
                    message : '该Job名称已经存在，请选择其它Job名称重试!'
                });
            }
        });

        editParamShellUpload = $("#edit_param_shell_upload").uploadFile({
            url : "job/manager/uploadFiles",
            multiple : false,
            autoSubmit : false,
            dragDrop : false
        });
    },

    ajaxRequest : function(datas, oper) {
        $.ajax({
            type : "POST",
            url : "job/manager/" + oper,
            data : JSON.stringify(datas),
            contentType : "application/json",
            dataType : "json",
            success : function(data) {
                if (data != null) {
                    if (data.returnFlag == "ok") {
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
    },

    initCombobox : function() {
        jobManager.initComBoStyle();
        jobManager.initComboboxData();
    },

    initComboboxData : function() {
        var url = "code_in_use/getAllCodeFilename";
        $('#edit_excute_filename').combobox('reload', url);
        $('#add_excute_filename').combobox('reload', url);
    },

    initComBoStyle : function() {
        $(".textbox-text").css({
            'margin-left' : 0,
            'margin-right' : 18,
            'padding-top' : 1,
            'padding-bottom' : 1,
            'width' : 196,
            'height' : 40,
            'font-size' : 15
        });
        $(".textbox").css({
            'width' : 196,
            'height' : 40,
        });
        $("select").css('width', 196);
        // $().css("height",40);
    },

    bind : function() {
        $("#section_condition>div>span").each(function() {
            $(this).bind('click', function() {
                var clickId = $(this).attr('id');
                var clickGroup = clickId.split('-')[0];

                var value = $(this).html();

                $(this).parent().children().removeClass('label');
                $(this).parent().children().removeClass('label-danger');

                $(this).addClass('label');
                $(this).addClass('label-danger');

                var nContainCount = 0
                $("#section_condition_filter>span").each(function() {
                    var id = $(this).attr('id');
                    var group = id.split('-')[1];

                    isContain = group.indexOf(clickGroup);
                    if (-1 != isContain) {
                        nContainCount++;

                        if (value != '不限') {
                            $("#tag-" + clickGroup).html("&nbsp;&nbsp;" + value + "&nbsp;&nbsp;<img src='images/cha_touming.png' />&nbsp;&nbsp;</span>");
                        } else {
                            $("#tag-" + clickGroup).remove();
                        }
                    }
                });

                if (0 == nContainCount || $("#section_condition_filter").children().length == 1) {
                    var htmlString = "<span id=\"tag-" + clickGroup + "\" class='tag'>&nbsp;&nbsp;" + value + "&nbsp;&nbsp;<img src='images/cha_touming.png' />&nbsp;&nbsp;</span>";
                    if (value != '不限') {
                        $("#section_condition_filter").append(htmlString);
                    }
                }

                // dynamic search
                var filterCondition;
                var searchCondition = $("#seach_condition").val();

                $("#section_condition_filter>span").each(function() {
                    var id = $(this).attr('id');
                    var group = id.split('-')[1];
                    var grossValue = $(this).html();
                    var netValue = grossValue.split('&nbsp;&nbsp;')[1];

                    if (-1 != id.indexOf("type")) {
                        filterCondition = netValue;
                    }
                });

                $('#job_manager_table').datagrid('load', {
                    'search_condition' : searchCondition,
                    'filter_condition' : filterCondition
                });
            });
        });

        $("#search").bind('click', function() {
            var clickGroup = "searchbox";
            var searchCondition = $('#search_condition').val();

            if (searchCondition != '') {
                var nContainCount = 0
                $("#section_condition_filter>span").each(function() {
                    var id = $(this).attr('id');
                    var group = id.split('-')[1];

                    isContain = group.indexOf(clickGroup);
                    if (-1 != isContain) {
                        nContainCount++;

                        $("#tag-" + clickGroup).html("&nbsp;&nbsp;" + searchCondition + "&nbsp;&nbsp;<img src='images/cha_touming.png' />&nbsp;&nbsp;</span>");
                    }
                });

                if (0 == nContainCount || $("#section_condition_filter").children().length == 1) {
                    var htmlString = "<span id=\"tag-" + clickGroup + "\" class='tag'>&nbsp;&nbsp;" + searchCondition + "&nbsp;&nbsp;<img src='images/cha_touming.png' />&nbsp;&nbsp;</span>";
                    $("#section_condition_filter").append(htmlString);
                }
            }

            var filterCondition;

            $("#section_condition_filter>span").each(function() {
                var id = $(this).attr('id');
                var group = id.split('-')[1];
                var grossValue = $(this).html();
                var netValue = grossValue.split('&nbsp;&nbsp;')[1];

                if (-1 != id.indexOf("type")) {
                    filterCondition = netValue;
                }
            });

            $('#job_manager_table').datagrid('load', {
                'search_condition' : searchCondition,
                'filter_condition' : filterCondition
            });
        });

        $("#java_job").bind('click', function() {
            $("#create_job_java_dialog").modal('show');
        });

        $("#shell_job").bind('click', function() {
            $("#create_job_shell_dialog").modal('show');
        });

        $("#hive_job").bind('click', function() {
            $("#create_job_hive_dialog").modal('show');
        });

        $("#data_sync_job").bind('click', function() {
            $("#create_job_data_sync_dialog_title").html('创建同步Job');

            $("#create_job_data_sync_dialog").modal('show');
        });

        $("#delete").bind('click', function() {
            var rows = $('#job_manager_table').datagrid('getChecked');
            var row = rows[0];

            if (0 == rows.length) {
                BootstrapDialog.show({
                    title : '警告',
                    message : '请选择一个Job！'
                });
                return;
            } else {
                BootstrapDialog.confirm('确定要删除选中Job吗?', function(result) {
                    if (result) {
                        datas = {
                            "id" : row.id,
                            "jobType" : row.jobType
                        };

                        $.ajax({
                            type : "POST",
                            url : "job/manager/deleteNew",
                            data : JSON.stringify(datas),
                            dataType : "json",
                            contentType : "application/json",
                            success : function(data) {
                                if (data != null) {
                                    if (data.returnFlag == "ok") {
                                        BootstrapDialog.show({
                                            title : '结果',
                                            message : '删除成功！'
                                        });

                                        window.location.reload();
                                    } else {
                                        BootstrapDialog.show({
                                            title : '结果',
                                            message : '删除失败！'
                                        });
                                    }
                                }
                            },
                            error : function(data) {
                                BootstrapDialog.show({
                                    title : '错误',
                                    message : '结果异常！'
                                });
                            }
                        });
                    }
                });
            }
        });

        $("#param_kv_add")
                .bind(
                        'click',
                        function() {
                            // calculate newKeyValueTrId
                            var lastKeyValueTrId = $(this).parent().parent().parent().children(':last').attr('id');
                            var splitId = lastKeyValueTrId.split("-");
                            var newKeyValueTrIdPart = parseInt(splitId[1]) + 1;
                            var newKeyValueTrId = splitId[0] + '-' + newKeyValueTrIdPart;

                            // generate html with newKeyValueTrId
                            var htmlString = "<tr id=\""
                                    + newKeyValueTrId
                                    + "\" class=\"margin-top-15\"><td><label id=\"key-value-add\" class=\"margin-left-50 width-40 custom_hover\" class=\"margin-left-50 custom_hover\"></label></td><td class=\"width-space\"></td><td><input type=\"text\" class=\"width-200 custom-input\" id=\"param_key\" placeholder=\"\"></td><td class=\"width-space\"></td><td><input type=\"text\" class=\"width-200 custom-input\" id=\"param_value\" placeholder=\"\"></td><td class=\"width-space\"></td><td><input id=\"param_kv_remove\" class=\"custom-delete-img-button\" type=\"image\" src=\"css/images/remove.png\" /></td></tr>";

                            // insert generated html
                            $(this).parent().parent().parent().children(':last').after(htmlString);
                        });

        $("#shell_param_kv_add")
                .bind(
                        'click',
                        function() {
                            // calculate newKeyValueTrId
                            var lastKeyValueTrId = $(this).parent().parent().parent().children(':last').attr('id');
                            var splitId = lastKeyValueTrId.split("-");
                            var newKeyValueTrIdPart = parseInt(splitId[1]) + 1;
                            var newKeyValueTrId = splitId[0] + '-' + newKeyValueTrIdPart;

                            // generate html with newKeyValueTrId
                            var htmlString = "<tr id=\""
                                    + newKeyValueTrId
                                    + "\" class=\"margin-top-15\"><td><label id=\"key-value-add\" class=\"margin-left-50 width-40 custom_hover\" class=\"margin-left-50 custom_hover\"></label></td><td class=\"width-space\"></td><td><input type=\"text\" class=\"width-350 custom-input\" id=\"shell_param_value\" placeholder=\"\"></td><td class=\"width-space\"></td><td><input id=\"param_kv_remove\" class=\"custom-delete-img-button\" type=\"image\" src=\"css/images/remove.png\" /></td></tr>";

                            // insert generated html
                            $(this).parent().parent().parent().children(':last').after(htmlString);
                        });

        $("#create_job_hive_dialog_save").bind('click', function() {
            var paramName = $("#param_name-hive").val();
            var paramDesc = $("#param_desc-hive").val();
            var code_id = $('#add_excute_filename').combobox('getValue');
            if (paramName == "" || code_id == "") {
                BootstrapDialog.show({
                    title : '警告',
                    message : '请将必填项填写完整！'
                });
                return false;
            }
            var datas = {
                "name" : paramName,
                "description" : paramDesc,
                "jobType" : 3,
                "codeId" : code_id
            };
            jobManager.ajaxRequest(datas, "addNew");
        });

        $("#edit_job_hive_dialog_save").bind('click', function() {
            var paramId = $("#edit_param_id-hive").val();
            var paramName = $("#edit_param_name-hive").val();
            var paramDesc = $("#edit_param_desc-hive").val();
            var code_id = $('#edit_excute_filename').combobox('getValue');
            if (paramName == "" || code_id == "") {
                BootstrapDialog.show({
                    title : '警告',
                    message : '请将必填项填写完整！'
                });
                return;
            }
            var datas = {
                "id" : paramId,
                "name" : paramName,
                "description" : paramDesc,
                "jobType" : 3,
                "codeId" : code_id
            };
            jobManager.ajaxRequest(datas, "editNew");
        });

        $("#create_job_java_dialog_save").bind('click', function() {
            var paramName = $("#param_name-java").val();
            var paramDesc = $("#param_desc-java").val();
            var paramJavaMainClass = $("#param_java_main_class").val();
            // var paramJarPath = $("#param_jar_path").val();
            var paramRunMemory = $("#param_run_memory").val();

            if (paramName == "" || paramJavaMainClass == "") {
                BootstrapDialog.show({
                    title : '警告',
                    message : '请将必填项填写完整！'
                });

                return;
            }

            var paramKV = '';

            $("#param_java_job_table").find("tr").each(function() {
                $(this).find("td").each(function() {
                    $(this).find("input").each(function() {
                        var keyId = $(this).attr('id');

                        if (-1 != keyId.indexOf('header')) {
                        } else {
                            if (-1 != keyId.indexOf('key') && $(this).val().length > 0) {
                                if (paramKV.length > 0) {
                                    paramKV = paramKV + '|' + $(this).val() + ':';
                                } else {
                                    paramKV = $(this).val() + ':';
                                }
                            } else if ($(this).val().length > 0) {
                                paramKV = paramKV + $(this).val();
                            }
                        }
                    });
                });
            });

            datas = {
                "name" : paramName,
                "description" : paramDesc,
                "jobType" : 1,
                "jarClassFullName" : paramJavaMainClass,
                "javaEnv" : paramRunMemory,
                "method" : paramRunMemory,
                "taskParameters" : paramKV
            };

            $.ajax({
                type : "POST",
                url : "job/manager/addNew",
                data : JSON.stringify(datas),
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    if (data != null) {
                        if (data.returnFlag == "ok") {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '添加成功!'
                            });

                            window.location.reload();
                        } else {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '添加失败！'
                            });
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '结果',
                        message : '添加失败！'
                    });
                }
            });
        });

        $("#edit_job_java_dialog_save").bind('click', function() {
            var paramId = $("#edit_param_id-java").val();
            var paramName = $("#edit_param_name-java").val();
            var paramDesc = $("#edit_param_desc-java").val();
            var paramJavaMainClass = $("#edit_param_java_main_class").val();
            var paramRunMemory = $("#edit_param_run_memory").val();

            if (paramName == "" || paramJavaMainClass == "") {
                BootstrapDialog.show({
                    title : '警告',
                    message : '请将必填项填写完整！'
                });

                return;
            }

            var paramKV = '';

            $("#edit_param_java_job_table").find("tr").each(function() {
                $(this).find("td").each(function() {
                    $(this).find("input").each(function() {
                        var keyId = $(this).attr('id');

                        if (-1 != keyId.indexOf('header')) {
                        } else {
                            if (-1 != keyId.indexOf('key') && $(this).val().length > 0) {
                                if (paramKV.length > 0) {
                                    paramKV = paramKV + '|' + $(this).val() + ':';
                                } else {
                                    paramKV = $(this).val() + ':';
                                }
                            } else if ($(this).val().length > 0) {
                                paramKV = paramKV + $(this).val();
                            }
                        }
                    });
                });
            });

            var paramHeaderKeyText = $("#edit_param_key_header").val();
            var paramHeaderValueText = $("#edit_param_value_header").val();

            if ((paramHeaderKeyText.length > 0) && (paramHeaderValueText.length > 0)) {
                if (paramKV.length > 0) {
                    paramKV = paramHeaderKeyText + ":" + paramHeaderValueText + "|" + paramKV;
                } else {
                    paramKV = paramHeaderKeyText + ":" + paramHeaderValueText;
                }
            }

            datas = {
                "id" : paramId,
                "name" : paramName,
                "description" : paramDesc,
                "jobType" : 1,
                "jarClassFullName" : paramJavaMainClass,
                "javaEnv" : paramRunMemory,
                "method" : paramRunMemory,
                "taskParameters" : paramKV
            };

            $.ajax({
                type : "POST",
                url : "job/manager/editNew",
                data : JSON.stringify(datas),
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    if (data != null) {
                        if (data.returnFlag == "ok") {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '编辑成功!'
                            });

                            window.location.reload();
                        } else {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '编辑失败！'
                            });
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '结果',
                        message : '结果失败！'
                    });
                }
            });
        });

        $("#create_job_shell_dialog_save").bind('click', function() {
            var paramName = $("#param_name-shell").val();
            var paramDesc = $("#param_desc-shell").val();
            var paramCommand = $("#param_command-shell").val();

            if (paramName == "" || paramCommand == "") {
                BootstrapDialog.show({
                    title : '警告',
                    message : '请将名称和命令填写完整！'
                });

                return;
            }

            datas = {
                "name" : paramName,
                "description" : paramDesc,
                "jobType" : 2,
                "taskParameters" : paramCommand
            };

            $.ajax({
                type : "POST",
                url : "job/manager/addNew",
                data : JSON.stringify(datas),
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    if (data != null) {
                        if (data.returnFlag == "ok") {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '添加成功!'
                            });

                            window.location.reload();
                        } else {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '添加失败！'
                            });
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '结果',
                        message : '添加失败！'
                    });
                }
            });
        });

        $("#edit_job_shell_dialog_save").bind('click', function() {
            var paramId = $("#edit_param_id-shell").val();
            var paramName = $("#edit_param_name-shell").val();
            var paramDesc = $("#edit_param_desc-shell").val();
            var paramCommand = $("#edit_param_command-shell").val();

            if (paramName == "" || paramCommand == "") {
                BootstrapDialog.show({
                    title : '警告',
                    message : '请将名称和命令填写完整！'
                });

                return;
            }

            datas = {
                "id" : paramId,
                "name" : paramName,
                "description" : paramDesc,
                "jobType" : 2,
                "taskParameters" : paramCommand
            };

            $.ajax({
                type : "POST",
                url : "job/manager/editNew",
                data : JSON.stringify(datas),
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    if (data != null) {
                        if (data.returnFlag == "ok") {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '编辑成功!'
                            });

                            window.location.reload();
                        } else {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '编辑失败！'
                            });
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '结果',
                        message : '编辑失败！'
                    });
                }
            });
        });

        $("#edit_param_kv_add")
                .bind(
                        'click',
                        function() {
                            // calculate newKeyValueTrId
                            var lastKeyValueTrId = $(this).parent().parent().parent().children(':last').attr('id');
                            var splitId = lastKeyValueTrId.split("-");
                            var newKeyValueTrIdPart = parseInt(splitId[1]) + 1;
                            var newKeyValueTrId = splitId[0] + '-' + newKeyValueTrIdPart;

                            // generate html with newKeyValueTrId
                            var htmlString = "<tr id=\"edit_param_row\" class=\"margin-top-15\"><td><label id=\"key-value-add\" class=\"margin-left-50 width-40 custom_hover\" class=\"margin-left-50 custom_hover\"></label></td><td class=\"width-space\"></td><td><input type=\"text\" class=\"width-200 custom-input\" id=\"param_key\" placeholder=\"\"></td><td class=\"width-space\"></td><td><input type=\"text\" class=\"width-200 custom-input\" id=\"param_value\" placeholder=\"\"></td><td class=\"width-space\"></td><td><input id=\"param_kv_remove\" class=\"custom-delete-img-button\" type=\"image\" src=\"css/images/remove.png\" /></td></tr>";

                            // insert generated html
                            $(this).parent().parent().parent().children(':last').after(htmlString);
                        });

        $("#param_src_database_type-data").bind('change', function() {
            srcDatabaseType = $(this).children('option:selected').val();

            $("#param_mysql_primary_key-data-form").css('display', 'none');

            switch (srcDatabaseType) {
            case '0':
                comboboxManager.disableCombobox('param_src_database_name-data');

                $("#param_mysql_primary_key-data-form").css('display', 'none');
                break;
            case '1':
                comboboxManager.enableComboboxDatabaseName('param_src_database_name-data', 1);

                $("#param_mysql_primary_key-data-form").css('display', 'none');
                break;
            case '2':
                comboboxManager.enableComboboxDatabaseName('param_src_database_name-data', 2);

                $("#param_mysql_primary_key-data-form").css('display', 'block');
                break;
            case '3':
                comboboxManager.enableComboboxDatabaseName('param_src_database_name-data', 3);

                $("#param_mysql_primary_key-data-form").css('display', 'none');
                break;
            }
        });

        $("#param_dst_database_type-data").bind('change', function() {
            dstDatabaseType = $(this).children('option:selected').val();

            switch (dstDatabaseType) {
            case '0':
                comboboxManager.disableCombobox('param_dst_database_name-data');
                break;
            case '1':
                comboboxManager.enableComboboxDatabaseName('param_dst_database_name-data', 1);
                break;
            case '2':
                comboboxManager.enableComboboxDatabaseName('param_dst_database_name-data', 2);
                break;
            case '3':
                comboboxManager.enableComboboxDatabaseName('param_dst_database_name-data', 3);
                break;
            }
        });

        $("#create_job_data_sync_dialog_save").bind('click', function() {
            var isOverride = -1;
            if ($("#param_is_override").is(':checked')) {
                isOverride = 1;
            } else {
                isOverride = 0;
            }

            var createOrEdit;

            // determine "create" or "edit"
            if (-1 != $("#create_job_data_sync_dialog_title").html().indexOf('创建')) {
                createOrEdit = 'create';
            } else {
                createOrEdit = 'edit';
            }

            srcDatabaseType = $("#param_src_database_type-data").children('option:selected').val();
            dstDatabaseType = $("#param_dst_database_type-data").children('option:selected').val();

            if (srcDatabaseType == '' || dstDatabaseType == '' || srcDatabaseType == dstDatabaseType || (srcDatabaseType != '1' && dstDatabaseType != 1)) {
                BootstrapDialog.show({
                    title : '错误',
                    message : '请选择正确的数据库类型！'
                });

                return;
            }

            var paramName = $("#param_name-data").val();
            var paramDescription = $("#param_description-data").val();
            var paramRunMemory = $("#param_run_memory-data").val();

            var paramSrcDbType = $("#param_src_database_type-data").val();
            var paramSrcDbName = $("#param_src_database_name-data").combobox('getText');
            var paramSrcDbId = $("#param_src_database_name-data").combobox('getValue');
            var paramSrcSchemaName = $("#param_src_schema_name-data").combobox('getText');
            var paramSrcTableName = $("#param_src_table_name-data").combobox('getText');

            var paramDstDbType = $("#param_dst_database_type-data").val();
            var paramDstDbName = $("#param_dst_database_name-data").combobox('getText');
            var paramDstDbId = $("#param_dst_database_name-data").combobox('getValue');
            var paramDstSchemaName = $("#param_dst_schema_name-data").combobox('getText');
            var paramDstTableName = $("#param_dst_table_name-data").combobox('getText');

            var paramSrcPartition = $("#param_src_partition").val();
            var paramDstPartition = $("#param_dst_partition").val();
            var paramSrcCondition = $("#param_src_condition").val();

            var mysqlPrimaryKeys = '';

            if (paramName == '' || paramDstPartition == '' || paramRunMemory == '') {
                BootstrapDialog.show({
                    title : '错误',
                    message : 'Job名称、Job运行内存和目标数据表的分区不能为空！'
                });

                return;
            }

            // job_src_table params
            var paramKvSrc = '';
            $("#job_src_table").find("tr").each(function() {
                $(this).find("td").each(function() {
                    $(this).find("input").each(function() {
                        var keyId = $(this).attr('id');

                        if (-1 != keyId.indexOf('header')) {
                        } else {
                            if (-1 != keyId.indexOf('name') && $(this).val().length > 0) {
                                if (paramKvSrc.length > 0) {
                                    paramKvSrc = paramKvSrc + '|' + $(this).val() + ':';
                                } else {
                                    paramKvSrc = $(this).val() + ':';
                                }
                            } else if (-1 != keyId.indexOf('type') && $(this).val().length > 0) {
                                paramKvSrc = paramKvSrc + $(this).val();
                            }
                        }
                    });
                });
            });

            // job_dst_table params
            var paramKvDst = '';
            $("#job_dst_table").find("tr").each(function() {
                $(this).find("td").each(function() {
                    $(this).find("input").each(function() {
                        var keyId = $(this).attr('id');

                        if (-1 != keyId.indexOf('header')) {
                        } else {
                            if (-1 != keyId.indexOf('name') && $(this).val().length > 0) {
                                if (paramKvDst.length > 0) {
                                    paramKvDst = paramKvDst + '|' + $(this).val() + ':';
                                } else {
                                    paramKvDst = $(this).val() + ':';
                                }
                            } else if (-1 != keyId.indexOf('type') && $(this).val().length > 0) {
                                paramKvDst = paramKvDst + $(this).val();
                            }
                        }
                    });
                });
            });

            // generate params
            // job_type
            var syncType;
            if (srcDatabaseType == '2' && dstDatabaseType == '1') {
                syncType = 1;

                mysqlPrimaryKeys = $("#param_mysql_primary_key-data").val();
            }
            if (srcDatabaseType == '1' && dstDatabaseType == '2') {
                syncType = 2;
            }
            if (srcDatabaseType == '1' && dstDatabaseType == '3') {
                syncType = 3;
            }

            // hive
            var hiveDbId;
            var hiveDbName;
            var hiveTableId;
            var hiveTableName;
            var hiveTableFields;
            var hiveTableCondition;
            var hiveTablePartition;

            // mysql
            var mysqlDbId;
            var mysqlDbName;
            var mysqlTableId;
            var mysqlTableName;
            var mysqlTableFields;
            var mysqlTableCondition;
            var mysqlTablePartition;

            // vertica
            var verticaDbId;
            var verticaDbName;
            var verticaSchemaName;
            var verticaTableId;
            var verticaTableName;
            var verticaTableFields;
            var verticaTableCondition;
            var verticaTablePartition;

            switch (srcDatabaseType) {
            case '1':
                hiveDbId = paramSrcDbId;
                hiveDbName = paramSrcDbName;
                hiveTableName = paramSrcTableName;
                hiveTableFields = paramKvSrc;
                hiveTableCondition = paramSrcCondition;
                hiveTablePartition = paramSrcPartition;
                break;
            case '2':
                mysqlDbId = paramSrcDbId;
                mysqlDbName = paramSrcDbName;
                mysqlTableName = paramSrcTableName;
                mysqlTableFields = paramKvSrc;
                mysqlTableCondition = paramSrcCondition;
                mysqlTablePartition = paramSrcPartition;
                break;
            case '3':
                verticaDbId = paramSrcDbId;
                verticaDbName = paramSrcDbName;
                verticaSchemaName = paramSrcSchemaName;
                verticaTableName = paramSrcTableName;
                verticaTableFields = paramKvSrc;
                verticaTableCondition = paramSrcCondition;
                verticaTablePartition = paramSrcPartition;
                break;
            }

            switch (dstDatabaseType) {
            case '1':
                hiveDbId = paramDstDbId;
                hiveDbName = paramDstDbName;
                hiveTableName = paramDstTableName;
                hiveTableFields = paramKvDst;
                hiveTablePartition = paramDstPartition;
                break;
            case '2':
                mysqlDbId = paramDstDbId;
                mysqlDbName = paramDstDbName;
                mysqlTableName = paramDstTableName;
                mysqlTableFields = paramKvDst;
                mysqlTablePartition = paramDstPartition;
                break;
            case '3':
                verticaDbId = paramDstDbId;
                verticaDbName = paramDstDbName;
                verticaSchemaName = paramDstSchemaName;
                verticaTableName = paramDstTableName;
                verticaTableFields = paramKvDst;
                verticaTablePartition = paramDstPartition;
                break;
            }

            // send request
            datas = {
                "name" : paramName,
                "description" : paramDescription,
                "javaEnv" : paramRunMemory,
                "jobType" : 4,
                "syncType" : syncType,
                "hiveDbId" : hiveDbId,
                "hiveDbName" : hiveDbName,
                "hiveTableName" : hiveTableName,
                "hiveTableFields" : hiveTableFields,
                "hiveTableCondition" : hiveTableCondition,
                "hiveTablePartition" : hiveTablePartition,
                "mysqlDbId" : mysqlDbId,
                "mysqlDbName" : mysqlDbName,
                "mysqlTableName" : mysqlTableName,
                "mysqlTableFields" : mysqlTableFields,
                "mysqlTableCondition" : mysqlTableCondition,
                "mysqlTablePartition" : mysqlTablePartition,
                "verticaDbId" : verticaDbId,
                "verticaDbName" : verticaDbName,
                "verticaSchemaName" : verticaSchemaName,
                "verticaTableName" : verticaTableName,
                "verticaTableFields" : verticaTableFields,
                "verticaTableCondition" : verticaTableCondition,
                "verticaTablePartition" : verticaTablePartition,
                "mysqlPrimaryKeys" : mysqlPrimaryKeys,
                "isOverride" : isOverride
            };

            // assign url value according to "createOrEdit"
            var dataSyncJobUrl;
            if (createOrEdit == 'create') {
                dataSyncJobUrl = "job/manager/addNew";
            } else {
                dataSyncJobUrl = "job/manager/editNew";
            }

            $.ajax({
                type : "POST",
                url : dataSyncJobUrl,
                data : JSON.stringify(datas),
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    if (data != null) {
                        if (data.returnFlag == "ok") {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '添加成功!'
                            });

                            window.location.reload();
                        } else {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '添加失败！'
                            });
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '结果',
                        message : '添加失败！'
                    });
                }
            });
        });

        $("#job_src_table_add").bind(
                'click',
                function() {
                    var htmlStringSrc = "<tr id=\"param_job_src_table_tr-" + fieldRowNumberSrc + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                            + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_src_column_id-data\" value=\"" + fieldRowNumberSrc + "\"></td>"
                            + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_name-data\"></td>"
                            + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_type-data\"></td>"
                            + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_src_table_tr-" + fieldRowNumberSrc
                            + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_src_table_tr-" + fieldRowNumberSrc
                            + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_src_table_tr-" + fieldRowNumberSrc + "')\"></a></td>" + "</tr>";

                    $("#job_src_table").append(htmlStringSrc);
                    fieldRowNumberSrc++;
                });

        $("#job_dst_table_add").bind(
                'click',
                function() {
                    var htmlStringDst = "<tr id=\"param_job_dst_table_tr-" + fieldRowNumberDst + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                            + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_src_column_id-data\" value=\"" + fieldRowNumberDst + "\"></td>"
                            + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_name-data\"></td>"
                            + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_type-data\"></td>"
                            + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_dst_table_tr-" + fieldRowNumberDst
                            + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_dst_table_tr-" + fieldRowNumberDst
                            + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_dst_table_tr-" + fieldRowNumberDst + "')\"></a></td>" + "</tr>";

                    $("#job_dst_table").append(htmlStringDst);
                    fieldRowNumberDst++;
                });

        $("#param_jar_upload_submit").bind('click', function() {
            var jobName = $("#param_name-java").val();
            if (jobName == '') {
                BootstrapDialog.show({
                    title : '警告',
                    message : '必须先填写Job名称'
                });
                return;
            }

            jobName = $("#param_name-java").val();

            formatData = {
                jobName : jobName,
                uploadType : 1
            };

            $.ajax({
                type : "POST",
                url : "job/manager/uploadFileParameter",
                data : {
                    "upload_job_name" : jobName,
                    "upload_job_type" : 1
                },
                dataType : "json",
                success : function(data) {
                    if (data != null) {
                        if (data.returnFlag == "ok") {
                            // upload files
                            paramJarUpload.startUpload();
                        } else {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '上传文件失败!'
                            });
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '结果',
                        message : '结果异常!'
                    });
                }
            });

        });

        $("#edit_param_jar_upload_submit").bind('click', function() {
            var jobName = $("#edit_param_name-java").val();
            if (jobName == '') {
                BootstrapDialog.show({
                    title : '警告',
                    message : '必须先填写Job名称'
                });
                return;
            }

            $.ajax({
                type : "POST",
                url : "job/manager/uploadFileParameter",
                data : {
                    "upload_job_name" : jobName,
                    "upload_job_type" : 1
                },
                dataType : "json",
                success : function(data) {
                    if (data != null) {
                        if (data.returnFlag == "ok") {
                            // upload files
                            editParamJarUpload.startUpload();
                        } else {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '上传文件失败!'
                            });
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '结果',
                        message : '结果异常!'
                    });
                }
            });

        });

        $("#param_shell_upload_submit").bind('click', function() {
            var jobName = $("#param_name-shell").val();
            if (jobName == '') {
                BootstrapDialog.show({
                    title : '警告',
                    message : '必须先填写Job名称'
                });
                return;
            }

            jobName = $("#param_name-shell").val();

            formatData = {
                jobName : jobName,
                uploadType : 2
            };

            $.ajax({
                type : "POST",
                url : "job/manager/uploadFileParameter",
                data : {
                    "upload_job_name" : jobName,
                    "upload_job_type" : 2
                },
                dataType : "json",
                success : function(data) {
                    if (data != null) {
                        if (data.returnFlag == "ok") {
                            // upload files
                            paramShellUpload.startUpload();
                        } else {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '上传文件失败!'
                            });
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '结果',
                        message : '结果异常!'
                    });
                }
            });
        });

        $("#edit_param_shell_upload_submit").bind('click', function() {
            var jobName = $("#edit_param_name-shell").val();
            if (jobName == '') {
                BootstrapDialog.show({
                    title : '警告',
                    message : '必须先填写Job名称'
                });
                return;
            }

            formatData = {
                jobName : jobName,
                uploadType : 1
            };

            $.ajax({
                type : "POST",
                url : "job/manager/uploadFileParameter",
                data : {
                    "upload_job_name" : jobName,
                    "upload_job_type" : 2
                },
                dataType : "json",
                success : function(data) {
                    if (data != null) {
                        if (data.returnFlag == "ok") {
                            // upload files
                            editParamShellUpload.startUpload();
                        } else {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '上传文件失败!'
                            });
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '结果',
                        message : '结果异常!'
                    });
                }
            });
        });

        $("#transform_to_jobflow").bind('click', function() {
            var rows = $('#job_manager_table').datagrid('getChecked');
            var row = rows[0];

            if (0 == rows.length) {
                BootstrapDialog.show({
                    title : '警告',
                    message : '请选择一个Job！'
                });
                return;
            } else {
                $("#jobflow_transformer_name").val(row.name + "-jobflow");

                $("#jobflow_transformer_job_id").val(row.id);
                $("#jobflow_transformer_job_name").val(row.name);
                $("#jobflow_transformer_job_type").val(row.jobType);

                $("#jobflow_transformer_dialog").modal('show');
            }
        });

        $("#jobflow_transformer_dialog_save").bind('click', function() {
            var jobflowName = $("#jobflow_transformer_name").val();
            var jobflowDesc = $("#jobflow_transformer_desc").val();
            var jobflowAlertMailBox = $("#jobflow_transformer_mailbox").val();

            var jobId = $("#jobflow_transformer_job_id").val();
            var jobName = $("#jobflow_transformer_job_name").val();
            var jobType = $("#jobflow_transformer_job_type").val();

            if (jobflowName == '' || jobflowAlertMailBox == '') {
                BootstrapDialog.show({
                    title : '警告',
                    message : '请填写jobflow名称和通知邮箱！'
                });
                
                return;
            }

            var taskJobflowDetail = {
                jobflowName : jobflowName,
                description : jobflowDesc,
                jobflowAlertMailBox : jobflowAlertMailBox,
                clientViewId : 1,
                jobType : jobType,
                jobName : jobName,
                parentJobId : 0
            };

            var arrTaskJobflowDetail = new Array();
            arrTaskJobflowDetail[0] = taskJobflowDetail;

            var datas = JSON.stringify(arrTaskJobflowDetail);

            $.ajax({
                type : "POST",
                url : "jobflow/manager/add",
                data : datas,
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    if (data != null) {
                        if (data.returnFlag == "ok") {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '转换成功!'
                            });

                            window.location.reload();
                        } else {
                            BootstrapDialog.show({
                                title : '结果',
                                message : '转换失败！'
                            });
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '结果',
                        message : '结果异常！'
                    });
                }
            });
        });
    },

    removeField : function(divId) {
        var currentRow = $("#" + divId + "");
        currentRow.remove();
    },

    downField : function(divId) {
        var currentRow = $("#" + divId + "");
        var nextRow = currentRow.next('tr');
        nextRow.after(currentRow);
    },

    upField : function(divId) {
        var currentRow = $("#" + divId + "");
        var prevRow = currentRow.prev('tr');

        if (prevRow.attr('id') == 'job_src_table_head' || prevRow.attr('id') == 'job_dst_table_head') {
            return;
        }

        prevRow.before(currentRow);
    }
}

var comboboxManager = {
    disableCombobox : function(divId) {
        $("#" + divId + "").combobox('clear');
        url = "data_vertica_databases/getNone";
        $("#" + divId + "").combobox('reload', url);
    },

    enableComboboxDatabaseName : function(divId, databaseType) {
        $("#" + divId + "").combobox('clear');

        switch (databaseType) {
        case 1:
        case '1':
            url = "hiveDataDatabases/getByCondition";
            $("#" + divId + "").combobox('reload', url);
            break;
        case 2:
        case '2':
            url = "data_mysql_databases/getByCondition";
            $("#" + divId + "").combobox('reload', url);
            break;
        case 3:
        case '3':
            url = "data_vertica_databases/getByCondition";
            $("#" + divId + "").combobox('reload', url);
            break;
        }
    },

    enableComboboxSchemaName : function(dbId, divId) {
        $("#" + divId + "").combobox('clear');

        url = "data_vertica_schema/getByDb?db_id=" + dbId;
        $("#" + divId + "").combobox('reload', url);
    },

    enableComboboxTableName : function(dbId, schemaId, srcOrDst) {
        if (srcOrDst == 'src') {
            $("#param_src_table_name-data").combobox('clear');

            switch (srcDatabaseType) {
            case 1:
            case '1':
                url = "hiveDataTable/getByDb?db_id=" + dbId;
                $("#param_src_table_name-data").combobox('reload', url);
                break;

            case 2:
            case '2':
                url = "data_mysql_table/getByDb?db_id=" + dbId;
                $("#param_src_table_name-data").combobox('reload', url);
                break;

            case 3:
            case '3':
                url = "data_vertica_table/getBySchema?db_id=" + dbId + "&schema_id=" + schemaId;
                $("#param_src_table_name-data").combobox('reload', url);
                break;
            }
        } else {
            $("#param_dst_table_name-data").combobox('clear');

            switch (dstDatabaseType) {
            case 1:
            case '1':
                url = "hiveDataTable/getByDb?db_id=" + dbId;
                $("#param_dst_table_name-data").combobox('reload', url);
                break;

            case 2:
            case '2':
                url = "data_mysql_table/getByDb?db_id=" + dbId;
                $("#param_dst_table_name-data").combobox('reload', url);
                break;

            case 3:
            case '3':
                url = "data_vertica_table/getBySchema?db_id=" + dbId + "&schema_id=" + schemaId;
                $("#param_dst_table_name-data").combobox('reload', url);
                break;
            }
        }

    },

    databaseOnChange : function(divId, rec) {
        var srcOrDst;
        if (-1 != divId.indexOf("src")) {
            srcOrDst = 'src';
        } else {
            srcOrDst = 'dst';
        }

        if (srcOrDst == 'src') {
            srcDbId = rec.id;

            if (srcDatabaseType == '0') {
                // comboboxManager.disableCombobox('param_src_table_name-data');
            } else if (srcDatabaseType == '3') {
                comboboxManager.enableComboboxSchemaName(rec.id, 'param_src_schema_name-data');
            } else {
                comboboxManager.enableComboboxTableName(rec.id, -1, srcOrDst);
            }
        } else {
            dstDbId = rec.id;

            if (dstDatabaseType == '0') {
                // comboboxManager.disableCombobox('param_dst_table_name-data');
            } else if (dstDatabaseType == '3') {
                comboboxManager.enableComboboxSchemaName(rec.id, 'param_dst_schema_name-data');
            } else {
                comboboxManager.enableComboboxTableName(rec.id, -1, srcOrDst);
            }
        }
    },

    schemaOnChange : function(divId, rec) {
        var dbId;

        var srcOrDst;
        if (-1 != divId.indexOf("src")) {
            srcOrDst = 'src';
            dbId = srcDbId;
        } else {
            srcOrDst = 'dst';
            dbId = dstDbId;
        }

        comboboxManager.enableComboboxTableName(dbId, rec.strSchemaId, srcOrDst);
    },

    srcTableOnChange : function(divId, rec) {
        fieldRowNumberSrc = 1;
        fieldRowNumberDst = 1;

        var paramJobSrcTableLength = $("tr[id*='param_job_src_table']").length;
        var paramJobDstTableLength = $("tr[id*='param_job_dst_table']").length;

        $("tr[id*='param_job_src_table']").remove();

        var dbId = $("#param_src_database_name-data").combobox('getValue');
        // var schemaId= $("#param_src_schema_name-data").combobox('getValue');
        var tableName = $("#param_src_table_name-data").combobox('getValue');
        switch (srcDatabaseType) {
        case 1:
        case '1':
            $.ajax({
                type : "POST",
                url : "data_table_column/getByHiveTable?db_id=" + dbId + "&table_name=" + tableName,
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    var paramJobSrcTableLength = data.length;
                    if (paramJobSrcTableLength != paramJobDstTableLength) {
                        $("tr[id*='param_job_dst_table']").remove();
                    }

                    for ( var i in data) {
                        var htmlStringSrc = "<tr id=\"param_job_src_table_tr-" + fieldRowNumberSrc + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_src_column_id-data\" value=\"" + fieldRowNumberSrc + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_name-data\" value=\"" + data[i].name + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_type-data\" value=\"" + data[i].type + "\"></td>"
                                + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_src_table_tr-" + fieldRowNumberSrc
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_src_table_tr-" + fieldRowNumberSrc
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_src_table_tr-" + fieldRowNumberSrc + "')\"></a></td>"
                                + "</tr>";

                        $("#job_src_table").append(htmlStringSrc);
                        fieldRowNumberSrc++;

                        if (paramJobSrcTableLength != paramJobDstTableLength) {
                            var htmlStringDst = "<tr id=\"param_job_dst_table_tr-" + fieldRowNumberDst + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                    + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_dst_column_id-data\" value=\"" + fieldRowNumberDst + "\"></td>"
                                    + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_name-data\"></td>"
                                    + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_type-data\"></td>"
                                    + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_dst_table_tr-" + fieldRowNumberDst
                                    + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_dst_table_tr-" + fieldRowNumberDst
                                    + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_dst_table_tr-" + fieldRowNumberDst
                                    + "')\"></a></td></td>" + "</tr>";

                            $("#job_dst_table").append(htmlStringDst);
                            fieldRowNumberDst++;
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '错误',
                        message : '结果异常！'
                    });
                }
            });
            break;

        case 2:
        case '2':
            $.ajax({
                type : "POST",
                url : "data_table_column/getByMysqlTable?db_id=" + dbId + "&table_name=" + tableName,
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    var paramJobSrcTableLength = data.length;
                    if (paramJobSrcTableLength != paramJobDstTableLength) {
                        $("tr[id*='param_job_dst_table']").remove();
                    }

                    for ( var i in data) {
                        var htmlStringSrc = "<tr id=\"param_job_src_table_tr-" + fieldRowNumberSrc + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_src_column_id-data\" value=\"" + fieldRowNumberSrc + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_name-data\" value=\"" + data[i].name + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_type-data\" value=\"" + data[i].type + "\"></td>"
                                + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_src_table_tr-" + fieldRowNumberSrc
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_src_table_tr-" + fieldRowNumberSrc
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_src_table_tr-" + fieldRowNumberSrc + "')\"></a></td>"
                                + "</tr>";

                        $("#job_src_table").append(htmlStringSrc);
                        fieldRowNumberSrc++;

                        if (paramJobSrcTableLength != paramJobDstTableLength) {
                            var htmlStringDst = "<tr id=\"param_job_dst_table_tr-" + fieldRowNumberDst + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                    + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_dst_column_id-data\" value=\"" + fieldRowNumberDst + "\"></td>"
                                    + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_name-data\"></td>"
                                    + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_type-data\"></td>"
                                    + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_dst_table_tr-" + fieldRowNumberDst
                                    + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_dst_table_tr-" + fieldRowNumberDst
                                    + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_dst_table_tr-" + fieldRowNumberDst
                                    + "')\"></a></td></td>" + "</tr>";

                            $("#job_dst_table").append(htmlStringDst);
                            fieldRowNumberDst++;
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '错误',
                        message : '结果异常！'
                    });
                }
            });
            break;

        case 3:
        case '3':
            $.ajax({
                type : "POST",
                url : "data_table_column/getByVerticaTable?db_id=" + dbId + "&table_id=" + rec.strTableId,
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    var paramJobSrcTableLength = data.length;
                    if (paramJobSrcTableLength != paramJobDstTableLength) {
                        $("tr[id*='param_job_dst_table']").remove();
                    }

                    for ( var i in data) {
                        var htmlStringSrc = "<tr id=\"param_job_src_table_tr-" + fieldRowNumberSrc + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_src_column_id-data\" value=\"" + fieldRowNumberSrc + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_name-data\" value=\"" + data[i].name + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_src_column_type-data\" value=\"" + data[i].type + "\"></td>"
                                + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_src_table_tr-" + fieldRowNumberSrc
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_src_table_tr-" + fieldRowNumberSrc
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_src_table_tr-" + fieldRowNumberSrc + "')\"></a></td>"
                                + "</tr>";

                        $("#job_src_table").append(htmlStringSrc);
                        fieldRowNumberSrc++;

                        if (paramJobSrcTableLength != paramJobDstTableLength) {
                            var htmlStringDst = "<tr id=\"param_job_dst_table_tr-" + fieldRowNumberDst + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                    + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_dst_column_id-data\" value=\"" + fieldRowNumberDst + "\"></td>"
                                    + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_name-data\"></td>"
                                    + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_type-data\"></td>"
                                    + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_dst_table_tr-" + fieldRowNumberDst
                                    + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_dst_table_tr-" + fieldRowNumberDst
                                    + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_dst_table_tr-" + fieldRowNumberDst
                                    + "')\"></a></td></td>" + "</tr>";

                            $("#job_dst_table").append(htmlStringDst);
                            fieldRowNumberDst++;
                        }
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '错误',
                        message : '结果异常！'
                    });
                }
            });
            break;
        }
    },

    dstTableOnChange : function(divId, rec) {
        fieldRowNumberDst = 1;

        $("tr[id*='param_job_dst_table']").remove();

        var dbId = $("#param_dst_database_name-data").combobox('getValue');
        var tableName = $("#param_dst_table_name-data").combobox('getValue');

        switch (dstDatabaseType) {
        case 1:
        case '1':
            $.ajax({
                type : "POST",
                url : "data_table_column/getByHiveTable?db_id=" + dbId + "&table_name=" + tableName,
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    for ( var i in data) {
                        var htmlStringDst = "<tr id=\"param_job_dst_table_tr-" + fieldRowNumberDst + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_dst_column_id-data\" value=\"" + fieldRowNumberDst + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_name-data\" value=\"" + data[i].name + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_type-data\" value=\"" + data[i].type + "\"></td>"
                                + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_dst_table_tr-" + fieldRowNumberDst
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_dst_table_tr-" + fieldRowNumberDst
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_dst_table_tr-" + fieldRowNumberDst + "')\"></a></td></td>"
                                + "</tr>";

                        $("#job_dst_table").append(htmlStringDst);
                        fieldRowNumberDst++;
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '错误',
                        message : '结果异常！'
                    });
                }
            });
            break;

        case 2:
        case '2':
            $.ajax({
                type : "POST",
                url : "data_table_column/getByMysqlTable?db_id=" + dbId + "&table_name=" + tableName,
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    for ( var i in data) {
                        var htmlStringDst = "<tr id=\"param_job_dst_table_tr-" + fieldRowNumberDst + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_dst_column_id-data\" value=\"" + fieldRowNumberDst + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_name-data\" value=\"" + data[i].name + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_type-data\" value=\"" + data[i].type + "\"></td>"
                                + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_dst_table_tr-" + fieldRowNumberDst
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_dst_table_tr-" + fieldRowNumberDst
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_dst_table_tr-" + fieldRowNumberDst + "')\"></a></td></td>"
                                + "</tr>";

                        $("#job_dst_table").append(htmlStringDst);
                        fieldRowNumberDst++;
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '错误',
                        message : '结果异常！'
                    });
                }
            });
            break;

        case 3:
        case '3':
            $.ajax({
                type : "POST",
                url : "data_table_column/getByVerticaTable?db_id=" + dbId + "&table_id=" + rec.strTableId,
                contentType : "application/json",
                dataType : "json",
                success : function(data) {
                    for ( var i in data) {
                        var htmlStringDst = "<tr id=\"param_job_dst_table_tr-" + fieldRowNumberDst + "\">" + "<td><label class=\"margin-left-50 width-40\"></label></td>"
                                + "<td><input type=\"text\" class=\"width-50 custom-input\" id=\"edit_param_dst_column_id-data\" value=\"" + fieldRowNumberDst + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_name-data\" value=\"" + data[i].name + "\"></td>"
                                + "<td><input type=\"text\" class=\"width-90 custom-input\" id=\"edit_param_dst_column_type-data\" value=\"" + data[i].type + "\"></td>"
                                + "<td><a class=\"clickstyle glyphicon glyphicon-remove\" onclick=\"jobManager.removeField('param_job_dst_table_tr-" + fieldRowNumberDst
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-down\" onclick=\"jobManager.downField('param_job_dst_table_tr-" + fieldRowNumberDst
                                + "')\"></a><a class=\"clickstyle glyphicon glyphicon-chevron-up\" onclick=\"jobManager.upField('param_job_dst_table_tr-" + fieldRowNumberDst + "')\"></a></td></td>"
                                + "</tr>";

                        $("#job_dst_table").append(htmlStringDst);
                        fieldRowNumberDst++;
                    }
                },
                error : function(data) {
                    BootstrapDialog.show({
                        title : '错误',
                        message : '结果异常！'
                    });
                }
            });
            break;
        }
    }
}