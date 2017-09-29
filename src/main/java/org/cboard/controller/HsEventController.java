package org.cboard.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leyao.app_service.entity.GridContent;
import com.leyao.app_service.util.HttpClientUtils;

@RestController
@RequestMapping("/LeyaoManager/v1/service/event")
public class HsEventController {
    private static final Logger logger = LoggerFactory.getLogger(HsEventController.class);

    @RequestMapping(value = "/postTEventSummaryByCondition", method = RequestMethod.POST)
    public String postTEventSummaryByCondition(@RequestParam(value = "page", defaultValue = "1") Integer page, @RequestParam(value = "rows", defaultValue = "10") Integer rows,
                    @RequestParam(value = "sessionCode", required = false) String sessionCode, @RequestParam(value = "hUserPhoneNr", required = false) Long hUserPhoneNr,
                    @RequestParam(value = "sEventCategoryCd", required = false) Integer sEventCategoryCd, @RequestParam(value = "sEventTypeCd", required = false) Integer sEventTypeCd,
                    @RequestParam(value = "sUserEventLikeInd", required = false) Integer sUserEventLikeInd, @RequestParam(value = "sUserEventReadLogTxt", required = false) String sUserEventReadLogTxt,
                    @RequestParam(value = "sEventSearchContentTxt", required = false) String sEventSearchContentTxt) {
        logger.info("/v1/service/event/postTEventSummaryByCondition() called: sessionCode={}, page={}, rows={},hUserPhoneNr={},sEventCategoryCd{},sEventTypeCd={},sUserEventLikeInd={},sUserEventReadLogTxt={},sEventSearchContentTxt={}",
                        sessionCode, page, rows, hUserPhoneNr, sEventCategoryCd, sEventTypeCd, sUserEventLikeInd, sUserEventReadLogTxt, sEventSearchContentTxt);
        GridContent gridContent = new GridContent();
        String result = null;

        try {
            int start = (page - 1) * rows;
            int end = rows;

            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("start", start);
            paramMap.put("end", end);
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

            result = HttpClientUtils.httpGet("http://localhost:8088/v1/service/event/getTEventSummaryByType?sessionCode=hello", paramMap);
        } catch (Exception e) {
            logger.error("/v1/service/event/getTEventSummaryByCondition()", e);
            return result;
        }

        return result;
    }

    @RequestMapping(value = "/getTEventSummaryByCondition", method = RequestMethod.GET)
    public String getTEventSummaryByCondition(@RequestParam(value = "page", defaultValue = "1") Integer page, @RequestParam(value = "rows", defaultValue = "10") Integer rows,
                    @RequestParam(value = "sessionCode", required = false) String sessionCode, @RequestParam(value = "hUserPhoneNr", required = false) Long hUserPhoneNr,
                    @RequestParam(value = "sEventCategoryCd", required = false) Integer sEventCategoryCd, @RequestParam(value = "sEventTypeCd", required = false) Integer sEventTypeCd,
                    @RequestParam(value = "sUserEventLikeInd", required = false) Integer sUserEventLikeInd, @RequestParam(value = "sUserEventReadLogTxt", required = false) String sUserEventReadLogTxt,
                    @RequestParam(value = "sEventSearchContentTxt", required = false) String sEventSearchContentTxt) {
        logger.info("/v1/service/event/getTEventSummaryByCondition() called: sessionCode={}, page={}, rows={},hUserPhoneNr={},sEventCategoryCd{},sEventTypeCd={},sUserEventLikeInd={},sUserEventReadLogTxt={},sEventSearchContentTxt={}",
                        sessionCode, page, rows, hUserPhoneNr, sEventCategoryCd, sEventTypeCd, sUserEventLikeInd, sUserEventReadLogTxt, sEventSearchContentTxt);
        GridContent gridContent = new GridContent();
        String result = null;

        try {
            int start = (page - 1) * rows;
            int end = rows;

            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("start", start);
            paramMap.put("end", end);
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

            result = HttpClientUtils.httpGet("http://localhost:8088/v1/service/event/getTEventSummaryByType?sessionCode=hello", paramMap);
        } catch (Exception e) {
            logger.error("/v1/service/event/getTEventSummaryByCondition()", e);
            return result;
        }

        return "done";
    }
}