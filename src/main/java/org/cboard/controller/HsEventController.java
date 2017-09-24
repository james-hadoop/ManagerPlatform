package org.cboard.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leyao.app_service.entity.GridContent;
import com.leyao.app_service.entity.hs_event.TEventSummary;

@RestController
@RequestMapping("/v1/service/event")
public class HsEventController {

    @RequestMapping(value = "/postTEventSummaryByType", method = RequestMethod.POST)
    public GridContent postTEventSummaryByType(@RequestParam(value = "page", defaultValue = "1") Integer page, @RequestParam(value = "rows", defaultValue = "10") Integer rows,
                    @RequestParam(value = "sEventTypeCd", defaultValue = "-1") Integer sEventTypeCd, @RequestParam(value = "sessionCode", required = true) String sessionCode) {
       // logger.info("/v1/service/event/postTEventSummaryByType() called: sessionCode={}, sEventTypeCd={}, page={}, rows={}", sessionCode, sEventTypeCd, page, rows);
        GridContent gridContent = new GridContent();

//        try {
//            int start = (page - 1) * rows;
//            int end = rows;
//
//            Map<String, Object> paramMap = new HashMap<String, Object>();
//            paramMap.put("sEventTypeCd", sEventTypeCd);
//            paramMap.put("start", start);
//            paramMap.put("end", end);
//
//            List<TEventSummary> tEventSummaryList = hsEventService.getTEventSummaryByType(paramMap);
//            int count = hsEventService.getTEventSummaryByTypeCount(paramMap);
//
//            // List<TEventSummary> tEventSummaryList = new
//            // ArrayList<TEventSummary>();
//            // int count = 0;
//
//            gridContent.setRows(tEventSummaryList);
//            gridContent.setTotal(count);
//        } catch (Exception e) {
//            logger.error("/v1/service/event/postTEventSummaryByType()", e);
//            return gridContent;
//        }

        return gridContent;
    }
}
