package com.app_service.entity;

import com.app_service.entity.enums.ResponseResultEnum;

public class ResponseContent {
    private ResponseResultEnum responseResult;
    private String responseResultMsg;

    public ResponseResultEnum getResponseResult() {
        return responseResult;
    }

    public void setResponseResult(ResponseResultEnum responseResult) {
        this.responseResult = responseResult;
    }

    public String getResponseResultMsg() {
        return responseResultMsg;
    }

    public void setResponseResultMsg(String responseResultMsg) {
        this.responseResultMsg = responseResultMsg;
    }
}
