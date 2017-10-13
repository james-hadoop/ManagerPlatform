package org.cboard.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.leyao.app_service.util.HttpClientUtils;

@RestController
@RequestMapping("/v1/service/user")
public class HsUserController {
    private static final Logger logger = LoggerFactory.getLogger(HsUserController.class);

    @RequestMapping(value = "/get", method = RequestMethod.POST)
    @ResponseBody
    public String get(@RequestBody String parameters) {
        logger.info("/v1/service/user/get() called: parameters={}", parameters);
        String result = null;

        try {
            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/user/getTUserSummary", parameters);
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