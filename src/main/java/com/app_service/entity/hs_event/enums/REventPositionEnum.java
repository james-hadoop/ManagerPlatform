package com.app_service.entity.hs_event.enums;

public enum REventPositionEnum {
    Default("Default", 0), One("One", 1), Two("Two", 2), Three("Three", 3), Four("Four", 4), Five("Five", 5), Six("Six",
            6);

    private String value;
    private int code;

    private REventPositionEnum(String value, int code) {
        this.value = value;
        this.code = code;
    }

    public static String getValue(int code) {
        for (REventPositionEnum c : REventPositionEnum.values()) {
            if (c.getCode() == code) {
                return c.value;
            }
        }
        return null;
    }

    public static int getCode(String value) {
        for (REventPositionEnum c : REventPositionEnum.values()) {
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