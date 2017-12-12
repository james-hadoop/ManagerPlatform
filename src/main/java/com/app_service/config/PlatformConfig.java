package com.app_service.config;

import java.io.File;
import java.io.FileInputStream;
import java.net.URL;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class PlatformConfig {
    private static final Logger LOGGER = LoggerFactory.getLogger(PlatformConfig.class);
    private static final String CONFIG_FILE = "config.properties";

    private String prefix;
    private String audio;
    private String video;
    private String image;
    private String portrait;
    private Integer interval;

    private static volatile PlatformConfig instance;

    static {
        instance = new PlatformConfig();
    }

    public static PlatformConfig GetInstance() {
        return instance;
    }

    public PlatformConfig() {
        this.loadingConfig();
    }

    private void loadingConfig() {
        Properties props = new Properties();
        try {
            URL filePath = new URL(
                    PlatformConfig.class.getClassLoader().getResource("") + File.separator + CONFIG_FILE);

            File file = new File(filePath.toURI());
            FileInputStream fis = new FileInputStream(file);
            props.load(fis);
            fis.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
            throw new RuntimeException("Error in loading configuration");
        }

        this.prefix = props.getProperty("static.path.prefix", "");
        this.audio = props.getProperty("static.path.audio", "");
        this.video = props.getProperty("static.path.video", "");
        this.image = props.getProperty("static.path.image", "");
        this.portrait = props.getProperty("static.path.portrait", "");
        this.interval=Integer.parseInt(props.getProperty("static.path.interval",""));
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getAudio() {
        return audio;
    }

    public void setAudio(String audio) {
        this.audio = audio;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getPortrait() {
        return portrait;
    }

    public void setPortrait(String portrait) {
        this.portrait = portrait;
    }

    public Integer getInterval() {
        return interval;
    }

    public void setInterval(Integer interval) {
        this.interval = interval;
    }
}