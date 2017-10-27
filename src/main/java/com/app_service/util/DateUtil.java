package com.app_service.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;

public class DateUtil {

    public static final int MILLISECONDS = 1000 * 60 * 60 * 24;
    public static final String YYYY_MM_DD_HH_MM_SS_SSS = "yyyy-MM-dd HH:mm:ss.SSS";
    public static final String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";
    public static final String YYYYMMDDHHMMSSSSS = "yyyyMMddHHmmssSSS";
    public static final String YYYYMMDDHHMMSS = "yyyyMMddHHmmss";
    public static final String YYYY_MM_DD = "yyyy-MM-dd";
    public static final String YYYYMMDD = "yyyyMMdd";
    public static final String YYMMDD = "yyMMdd";
    public static final String YYYYMM = "yyyyMM";
    public static final String YYYY = "yyyy";
    public static final String MM = "MM";
    public static final String DD = "DD";
    public static final String HH_MM_SS = "HH:mm:ss";
    public static final String MM_DD_YYYY_HH_MM_SS = "MM/dd/yyyy HH:mm:ss";

    public static String DateToString(Date date) {
        DateFormat df = new SimpleDateFormat(YYYY_MM_DD);
        return DateToString(date, df);
    }

    public static String DateToString(Date date, String format) {
        DateFormat df = new SimpleDateFormat(format);
        return DateToString(date, df);
    }

    private static String DateToString(Date date, DateFormat df) {
        try {
            return df.format(date);
        } catch (Exception e) {
            return "";
        }
    }

    public static Date StringToDate(String sdate, String format) throws ParseException {
        DateFormat df = new SimpleDateFormat(format);
        return StringToDate(sdate, df);
    }

    public static Date StringToDate(String sdate) throws ParseException {
        DateFormat df = new SimpleDateFormat(YYYY_MM_DD);
        return StringToDate(sdate, df);
    }

    private static Date StringToDate(String sdate, DateFormat df) throws ParseException {
        if (StringUtils.isEmpty(sdate)) {
            return null;
        }
        return df.parse(sdate);
    }
    
    public static Long timeBetween(Date oldDate, Date nowDate){
        return Math.abs(nowDate.getTime()-oldDate.getTime());
    }
}