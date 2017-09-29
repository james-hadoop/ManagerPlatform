package com.leyao.app_service.util;

import java.util.concurrent.ConcurrentHashMap;

import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

public class SimpleHttpClient {
    public static final HttpClient default_http_client = SimpleHttpClient.getInstance("default");
    private static ConcurrentHashMap<String, CloseableHttpClient> http_client_cache = new ConcurrentHashMap<String, CloseableHttpClient>(2);

    private static CloseableHttpClient getInstance(String clientKey) {
        if (http_client_cache == null) {
            http_client_cache = new ConcurrentHashMap<String, CloseableHttpClient>(2);
        }
        CloseableHttpClient client = http_client_cache.get(clientKey);
        if (client == null) {
            client = HttpClients.createDefault();
            http_client_cache.putIfAbsent(clientKey, client);
        }
        return client;
    }
}