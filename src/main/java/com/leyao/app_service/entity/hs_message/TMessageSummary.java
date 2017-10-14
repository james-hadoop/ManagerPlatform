package com.leyao.app_service.entity.hs_message;

import java.util.Date;

import com.leyao.app_service.entity.hs_message.enums.RMessageCategoryEnum;
import com.leyao.app_service.util.DateUtil;

public class TMessageSummary {
    private Long hMessageId;

    private Integer sMessageActiveInd;

    private Integer sMessageCategoryCd;
    
    private String sMessageCategoryDesc;

    private String sMessageContentStr;

    private Date createTs;
    
    private String createTsString;

    private Date updateTs;
    
    private String updateTsString;

    private Long hUserPhoneNr;

    public Long gethMessageId() {
        return hMessageId;
    }

    public void sethMessageId(Long hMessageId) {
        this.hMessageId = hMessageId;
    }

    public Integer getsMessageActiveInd() {
        return sMessageActiveInd;
    }

    public void setsMessageActiveInd(Integer sMessageActiveInd) {
        this.sMessageActiveInd = sMessageActiveInd;
    }

    public Integer getsMessageCategoryCd() {
        return sMessageCategoryCd;
    }

    public void setsMessageCategoryCd(Integer sMessageCategoryCd) {
        this.sMessageCategoryCd = sMessageCategoryCd;
    }

    public String getsMessageContentStr() {
        return sMessageContentStr;
    }

    public void setsMessageContentStr(String sMessageContentStr) {
        this.sMessageContentStr = sMessageContentStr;
    }

    public Date getCreateTs() {
        return createTs;
    }

    public void setCreateTs(Date createTs) {
        this.createTs = createTs;
    }

    public Date getUpdateTs() {
        return updateTs;
    }

    public void setUpdateTs(Date updateTs) {
        this.updateTs = updateTs;
    }

    public Long gethUserPhoneNr() {
        return hUserPhoneNr;
    }

    public void sethUserPhoneNr(Long hUserPhoneNr) {
        this.hUserPhoneNr = hUserPhoneNr;
    }

    public String getsMessageCategoryDesc() {
        return RMessageCategoryEnum.getValue(sMessageCategoryCd);
    }

    public void setsMessageCategoryDesc(String sMessageCategoryDesc) {
        this.sMessageCategoryDesc = sMessageCategoryDesc;
    }

    public String getCreateTsString() {
        return DateUtil.DateToString(createTs);
    }

    public void setCreateTsString(String createTsString) {
        this.createTsString = createTsString;
    }

    public String getUpdateTsString() {
        return DateUtil.DateToString(updateTs);
    }

    public void setUpdateTsString(String updateTsString) {
        this.updateTsString = updateTsString;
    }
}
