package com.app_service.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app_service.config.PlatformConfig;
import com.app_service.util.DataUtil;

@Service
public class StaticResourceFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(StaticResourceFilter.class);
    
    @Autowired
    private PlatformConfig config=PlatformConfig.GetInstance();

    @Override
    public void init(FilterConfig arg0) throws ServletException {
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        boolean isQulifiedStaticResourceAccess = false;
        try {
            String currentURL = request.getRequestURI();
            if (currentURL.contains("static")) {
                String queryString = request.getQueryString();

                if (null == queryString || 0 == queryString.length()) {
                    isQulifiedStaticResourceAccess = false;
                } else {
                    isQulifiedStaticResourceAccess = DataUtil.isQulifiedStaticResourceAccess(queryString,
                            config.getInterval());
                }
            } else {
                isQulifiedStaticResourceAccess = true;
            }

        } catch (Exception e) {
            // e.printStackTrace();
            logger.info("AuthorityFilter.doFilter() exception detected");
            isQulifiedStaticResourceAccess = false;
        }

        if (false == isQulifiedStaticResourceAccess) {
            response.sendRedirect("/global/errorPage");
        }

        chain.doFilter(request, response);
    }
}