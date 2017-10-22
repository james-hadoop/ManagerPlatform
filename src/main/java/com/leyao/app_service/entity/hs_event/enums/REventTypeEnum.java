package com.leyao.app_service.entity.hs_event.enums;

public enum REventTypeEnum {
    Undefined("Undefined", 0), Audio("Audio", 1), Video("Video", 2), Image("Image", 3);

    private String value;
    private int code;

    private REventTypeEnum(String value, int code) {
        this.value = value;
        this.code = code;
    }

    public static String getValue(int code) {
        for (REventTypeEnum c : REventTypeEnum.values()) {
            if (c.getCode() == code) {
                return c.value;
            }
        }
        return null;
    }

    public static int getCode(String value) {
        for (REventTypeEnum c : REventTypeEnum.values()) {
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