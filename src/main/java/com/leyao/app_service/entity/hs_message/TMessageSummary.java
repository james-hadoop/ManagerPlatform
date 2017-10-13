package com.leyao.app_service.entity.hs_message;

import java.util.Date;

public class TMessageSummary {
    private Long hMessageId;

    private Integer sMessageActiveInd;

    private Integer sMessageCategoryCd;

    private String sMessageContentStr;

    private Date createTs;

    private Date updateTs;

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
}
