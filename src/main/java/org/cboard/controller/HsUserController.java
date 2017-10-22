package org.cboard.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.leyao.app_service.util.HttpClientUtils;

@RestController
@RequestMapping("/v1/service/user")
public class HsUserController {
    private static final Logger logger = LoggerFactory.getLogger(HsUserController.class);

    @RequestMapping(value = "/get", method = RequestMethod.POST)
    public String get(@RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "rows", defaultValue = "10") Integer rows,
            @RequestParam(value = "sessionCode", defaultValue = "NoVerificaiton") String sessionCode,
            @RequestParam(value = "hUserPhoneNr", required = false) Long hUserPhoneNr,
            @RequestParam(value = "searchCondition", required = false) String searchCondition) {
        logger.info("/v1/service/user/get() called: hUserPhoneNr={}", hUserPhoneNr);
        String result = null;

        try {
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("page", page);
            paramMap.put("rows", rows);
            if (null != hUserPhoneNr) {
                paramMap.put("hUserPhoneNr", hUserPhoneNr);
            }
            if (null != sessionCode) {
                paramMap.put("sessionCode", sessionCode);
            }else {
                paramMap.put("sessionCode", "NoVerificaiton");
            }
            if(null!=searchCondition) {
                paramMap.put("searchCondition", searchCondition);
            }

            result = HttpClientUtils.httpGet("http://localhost:8088/v1/service/user/getTUserSummary", paramMap);
        } catch (Exception e) {
            logger.error("/v1/service/user/get() called: parameters={}", e);
            return result;
        }
        return result;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String add(@RequestBody String parameters) {
        logger.info("/v1/service/user/add() called: parameters={}", parameters);
        String result = null;

        try {
            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/user/addTUserSummary", parameters);
        } catch (Exception e) {
            logger.error("/v1/service/user/add() called: parameters={}", e);
            return result;
        }
        return result;
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public String edit(@RequestBody String parameters) {
        logger.info("/v1/service/user/edit() called: parameters={}", parameters);
        String result = null;

        try {
            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/user/editTUserSummary", parameters);
        } catch (Exception e) {
            logger.error("/v1/service/user/edit() called: parameters={}", e);
            return result;
        }
        return result;
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public String delete(@RequestBody String parameters) {
        logger.info("/v1/service/user/delete() called: parameters={}", parameters);
        String result = null;

        try {
            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/user/deleteTUserSummary", parameters);
        } catch (Exception e) {
            logger.error("/v1/service/user/delete() called: parameters={}", e);
            return result;
        }
        return result;
    }
}