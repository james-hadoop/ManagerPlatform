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

import com.app_service.util.HttpClientUtils;

@RestController
@RequestMapping("/v1/service/message")
public class HsMessageController {
    private static final Logger logger = LoggerFactory.getLogger(HsMessageController.class);

    @RequestMapping(value = "/get", method = RequestMethod.POST)
    public String get(@RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "rows", defaultValue = "10") Integer rows,
            @RequestParam(value = "sessionCode", defaultValue = "NoVerificaiton") String sessionCode,
            @RequestParam(value = "sMessageActiveInd", required = false) Long sMessageActiveInd,
            @RequestParam(value = "sMessageCategoryCd", required = false) Long sMessageCategoryCd,
            @RequestParam(value = "sMessageContentStr", required = false) String sMessageContentStr) {
        logger.info("/v1/service/message/get() called: sMessageActiveInd={}", sMessageActiveInd);
        String result = null;

        try {
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("page", page);
            paramMap.put("rows", rows);
            if (null != sessionCode) {
                paramMap.put("sessionCode", sessionCode);
            } else {
                paramMap.put("sessionCode", "NoVerificaiton");
            }
            if (null != sMessageActiveInd) {
                paramMap.put("sMessageActiveInd", sMessageActiveInd);
            }
            if (null != sMessageCategoryCd) {
                paramMap.put("sMessageCategoryCd", sMessageCategoryCd);
            }
            if (null != sMessageContentStr) {
                paramMap.put("sMessageContentStr", sMessageContentStr);
            }

            result = HttpClientUtils.httpGet("http://localhost:8088/v1/service/message/getTMessageSummaryListByConditionGlobal",
                    paramMap);
        } catch (Exception e) {
            logger.error("/v1/service/message/get() called: sMessageActiveInd={}", e);
            return result;
        }
        return result;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public String add(@RequestBody String parameters) {
        logger.info("/v1/service/message/add() called: parameters={}", parameters);
        String result = null;

        try {
            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/message/addTMessageSummary", parameters);
        } catch (Exception e) {
            logger.error("/v1/service/message/add() called: parameters={}", e);
            return result;
        }
        return result;
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public String edit(@RequestBody String parameters) {
        logger.info("/v1/service/message/edit() called: parameters={}", parameters);
        String result = null;

        try {
            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/message/editTMessageSummary", parameters);
        } catch (Exception e) {
            logger.error("/v1/service/message/edit() called: parameters={}", e);
            return result;
        }
        return result;
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public String delete(@RequestBody String parameters) {
        logger.info("/v1/service/message/delete() called: parameters={}", parameters);
        String result = null;

        try {
            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/message/deleteTMessageSummary",
                    parameters);
        } catch (Exception e) {
            logger.error("/v1/service/message/delete() called: parameters={}", e);
            return result;
        }
        return result;
    }
    
    @RequestMapping(value = "/associate", method = RequestMethod.POST)
    @ResponseBody
    public String associate(@RequestBody String parameters) {
        logger.info("/v1/service/message/associate() called: parameters={}", parameters);
        String result = null;

        try {
            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/message/associateTMessageSummary", parameters);
        } catch (Exception e) {
            logger.error("/v1/service/message/associate() called: parameters={}", e);
            return result;
        }
        return result;
    }
}