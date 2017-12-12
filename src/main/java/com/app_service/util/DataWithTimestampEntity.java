package com.app_service.util;

public class DataWithTimestampEntity {
    private String data;
    private long timestamp;

    public DataWithTimestampEntity() {

    }

    public DataWithTimestampEntity(String data, long timestamp) {
        this.data = data;
        this.timestamp = timestamp;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
