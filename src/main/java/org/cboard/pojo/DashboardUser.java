package org.cboard.pojo;

/**
 * Created by yfyuan on 2016/12/2.
 */
public class DashboardUser {
    private String userId;
    private String userName;
    private String loginName;
    private String userPassword;
    private String userStatus;
    private String cityNameArr;
    private String cityIdArr;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public String getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(String userStatus) {
        this.userStatus = userStatus;
    }

    public String getCityNameArr() {
        return cityNameArr;
    }

    public void setCityNameArr(String cityNameArr) {
        this.cityNameArr = cityNameArr;
    }

    public String getCityIdArr() {
        return cityIdArr;
    }

    public void setCityIdArr(String cityIdArr) {
        this.cityIdArr = cityIdArr;
    }
}
