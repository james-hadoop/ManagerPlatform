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

import com.app_service.util.CharsetTools;
import com.app_service.util.HttpClientUtils;

@RestController
@RequestMapping("/v1/service/event")
public class HsEventController {
    private static final Logger logger = LoggerFactory.getLogger(HsEventController.class);

    @RequestMapping(value = "/postTEventSummaryByCondition", method = RequestMethod.POST)
    public String postTEventSummaryByCondition(@RequestParam(value = "page", defaultValue = "1") Integer page, @RequestParam(value = "rows", defaultValue = "10") Integer rows,
                    @RequestParam(value = "sessionCode", required = false) String sessionCode, @RequestParam(value = "hUserPhoneNr", required = false) Long hUserPhoneNr,
                    @RequestParam(value = "sEventCategoryCd", required = false) Integer sEventCategoryCd, @RequestParam(value = "sEventTypeCd", required = false) Integer sEventTypeCd,
                    @RequestParam(value = "sUserEventLikeInd", required = false) Integer sUserEventLikeInd, @RequestParam(value = "sUserEventReadLogTxt", required = false) String sUserEventReadLogTxt,
                    @RequestParam(value = "sEventSearchContentTxt", required = false) String sEventSearchContentTxt,
                    @RequestParam(value = "urlString", required = false) String urlString) {
        logger.info("/v1/service/event/postTEventSummaryByCondition() called: sessionCode={}, page={}, rows={},hUserPhoneNr={},sEventCategoryCd={},sEventTypeCd={},sUserEventLikeInd={},sUserEventReadLogTxt={},sEventSearchContentTxt={}",
                        sessionCode, page, rows, hUserPhoneNr, sEventCategoryCd, sEventTypeCd, sUserEventLikeInd, sUserEventReadLogTxt, sEventSearchContentTxt);
        String result = null;

        try {
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("page", page);
            paramMap.put("rows", rows);
            if (null != hUserPhoneNr) {
                paramMap.put("hUserPhoneNr", hUserPhoneNr);
            }
            if (null != sEventCategoryCd) {
                paramMap.put("sEventCategoryCd", sEventCategoryCd);
            }
            if (null != sEventTypeCd) {
                paramMap.put("sEventTypeCd", sEventTypeCd);
            }
            if (null != sUserEventLikeInd) {
                paramMap.put("sUserEventLikeInd", sUserEventLikeInd);
            }
            if (null != sUserEventReadLogTxt) {
                paramMap.put("sUserEventReadLogTxt", sUserEventReadLogTxt);
            }
            if (null != sEventSearchContentTxt) {
                paramMap.put("sEventSearchContentTxt", sEventSearchContentTxt);
            }
            if (null != urlString) {
                paramMap.put("urlString", urlString);
            }

            result = HttpClientUtils.httpGet("http://localhost:8088/v1/service/event/getTEventSummaryByConditionGlobal?sessionCode=hello", paramMap);
        } catch (Exception e) {
            logger.error("/v1/service/event/postTEventSummaryByCondition()", e);
            return result;
        }

        return result;
    }

    @RequestMapping(value = "/addTEventSummary", method = RequestMethod.POST)
    @ResponseBody
    public String addTEventSummary(@RequestBody String tEventSummaryString) {
        logger.info("/v1/service/event/addTEventSummary() called: hEventId={}", tEventSummaryString);
        String result = null;

        try {

            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/event/addTEventSummary", tEventSummaryString);
        } catch (Exception e) {
            logger.error("/v1/service/event/addTEventSummary()", e);
            return result;
        }
        return result;
    }

    @RequestMapping(value = "/editTEventSummary", method = RequestMethod.POST)
    @ResponseBody
    public String editTEventSummary(@RequestBody String tEventSummaryString) {
        logger.info("/v1/service/event/editTEventSummary() called: hEventId={}", tEventSummaryString);
        String result = null;

        try {

            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/event/editTEventSummary", tEventSummaryString);
        } catch (Exception e) {
            logger.error("/v1/service/event/editTEventSummary()", e);
            return result;
        }
        return result;
    }

    @RequestMapping(value = "/deleteTEventSummary", method = RequestMethod.POST)
    @ResponseBody
    public String deleteTEventSummary(@RequestBody String tEventSummaryString) {
        logger.info("/v1/service/event/deleteTEventSummary() called: hEventId={}", tEventSummaryString);
        String result = null;

        try {

            result = HttpClientUtils.httpPost("http://localhost:8088/v1/service/event/deleteTEventSummary", tEventSummaryString);
        } catch (Exception e) {
            logger.error("/v1/service/event/deleteTEventSummary()", e);
            return result;
        }
        return result;
    }
}