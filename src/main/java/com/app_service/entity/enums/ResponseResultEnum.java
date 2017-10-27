package com.app_service.entity.enums;

public enum ResponseResultEnum {
    SUCCESS("SUCCESS", 0), ERROR("ERROR", -1);

    private String value;
    private int code;

    private ResponseResultEnum(String value, int code) {
        this.value = value;
        this.code = code;
    }

    public static String getValue(int code) {
        for (ResponseResultEnum c : ResponseResultEnum.values()) {
            if (c.getCode() == code) {
                return c.value;
            }
        }
        return null;
    }

    public static int getCode(String value) {
        for (ResponseResultEnum c : ResponseResultEnum.values()) {
            if (c.getValue().equals(value)) {
                return c.code;
            }
        }
        return -1;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }
}