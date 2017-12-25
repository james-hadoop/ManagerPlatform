package com.app_service.util;

import java.security.Key;
import java.util.Date;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DataUtil {
    private static final Logger logger = LoggerFactory.getLogger(DataUtil.class);

    private static String key = "key1key1key1key1";
    private static final long qualifiedInterval = 10 * 1000;

    private static final String CIPHER_ALGORITHM = "DES/ECB/PKCS5Padding";
    private static final String KEY_ALGORITHM = "DES";
    private static final String DIVIDER_BETWEEN_DATA_AND_TIMESTAMP = ",";

    public static void main(String[] args) throws Exception {
        long timestamp = new Date().getTime();
        String data = "hello james";

        String encodedData = DataUtil.encode(key, data, timestamp);
        System.out.println("timestamp=" + timestamp);
        System.out.println(data + " => " + encodedData);

        DataWithTimestampEntity entity = DataUtil.decode(key, encodedData);
        System.out.println(entity.getData() + " => " + entity.getTimestamp());
        System.out.println("----------------------- divider -------------------------");

        Thread.sleep(5 * 1000);

        boolean isQulifiedStaticResourceAccess = DataUtil.isQulifiedStaticResourceAccess(encodedData,
                qualifiedInterval);
        System.out.println("isQulifiedStaticResourceAccess=" + isQulifiedStaticResourceAccess);

    }

    private static Key toKey(byte[] key) throws Exception {
        DESKeySpec dks = new DESKeySpec(key);

        SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(KEY_ALGORITHM);

        SecretKey secretKey = keyFactory.generateSecret(dks);

        return secretKey;
    }

    private static String decrypt(String data, byte[] key) throws Exception {
        Key k = toKey(key);

        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);

        cipher.init(Cipher.DECRYPT_MODE, k);

        return new String(cipher.doFinal(Base64.decodeBase64(data)));
    }

    private static String encrypt(String data, byte[] key) throws Exception {
        Key k = toKey(key);

        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);

        cipher.init(Cipher.ENCRYPT_MODE, k);

        return Base64.encodeBase64String(cipher.doFinal(data.getBytes()));
    }

    public static String encode(String key, String data, long timestamp) throws Exception {
        String result = null;

        String str = data + DIVIDER_BETWEEN_DATA_AND_TIMESTAMP + Long.toString(timestamp);
        result = encrypt(str, key.getBytes());

        return result;
    }

    public static DataWithTimestampEntity decode(String key, String data) throws Exception {
        String decodedData = decrypt(data, key.getBytes());

        String[] arr = decodedData.split(DIVIDER_BETWEEN_DATA_AND_TIMESTAMP);
        DataWithTimestampEntity entity = new DataWithTimestampEntity(arr[0], Long.parseLong(arr[1]));

        return entity;
    }

    public static boolean isQulifiedStaticResourceAccess(String urlParameter, long qualifiedInterval) throws Exception {
        if (null == urlParameter || 0 == urlParameter.length()) {
            return false;
        }

        DataWithTimestampEntity entity = DataUtil.decode(key, urlParameter);
        // System.out.println(entity.getData() + " => " + entity.getTimestamp());

        long currentTimestamp = new Date().getTime();
        logger.info("isQulifiedStaticResourceAccess(): currentTimestamp={}, requestTimestamp={}, qualifiedInterval={}",
                currentTimestamp, entity.getTimestamp(), qualifiedInterval);

        if (qualifiedInterval > currentTimestamp - entity.getTimestamp()) {
            return true;
        }

        return false;
    }
}
