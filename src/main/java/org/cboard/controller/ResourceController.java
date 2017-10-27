package org.cboard.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resourceManager")
public class ResourceController {

    @Value("${static.path.prefix}")
    private String resourcePathPrefix;

    @RequestMapping(value = "/uploadResource")
    public void upload(@RequestParam("file") MultipartFile file, @RequestParam("targetDir") String targetDir)
            throws IOException {
        String destPath = resourcePathPrefix + targetDir + File.separator + file.getOriginalFilename();

        System.out.println("destPath=" + destPath);

        file.transferTo(new File(destPath));
    }
}