package com.leyao.app_service.entity.enums;

public enum StatusEnum {
    Active("Active", 0), NotActive("NotActive", 1);

    private String value;
    private int code;

    private StatusEnum(String value, int code) {
        this.value = value;
        this.code = code;
    }

    public static String getValue(int code) {
        for (StatusEnum c : StatusEnum.values()) {
            if (c.getCode() == code) {
                return c.value;
            }
        }
        return null;
    }

    public static int getCode(String value) {
        for (StatusEnum c : StatusEnum.values()) {
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