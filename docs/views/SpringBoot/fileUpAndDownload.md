---
title: "文件上传与下载"
date: 2021-10-15
tags:
- 文件操作
categories:
- 文件操作
isShowComments: false
---

# 配置参数

在application配置文件中加入如下参数(以.yml文件为例)  
```java
spring:
  servlet:
    multipart:
      # 开启multipart上传功能
      enabled: true
      # 文件写入磁盘的阈值
      file-size-threshold: 2KB
      # 最大文件大小
      max-file-size: 100MB
      # 最大请求大小
      max-request-size: 120MB

file:
  upload-dir: 'D:\live_applet\upload'

```
创建POJO类绑定自定义'file'参数,ReadFilePath.java

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
//接收application.yml中的file下面的属性
@ConfigurationProperties(prefix = "file")
public class ReadFilePath {
    private String uploadDir;

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }
}

```
创建资源实体类

```java
import java.util.Date;

public class FileResources {
    private String resourcesId;
    private String fileName;
    private String fileSuffix;
    private String fileType;
    private long fileSize;
    private String url;
    private Date createTime;
    private long userId;

    public FileResources( String fileName, String fileSuffix, String fileType, long fileSize, String url, long userId) {
        this.fileName = fileName;
        this.fileSuffix = fileSuffix;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.url = url;
        this.userId = userId;
    }
}
```
创建文件异常类
```java
public class FileException extends RuntimeException {
    public FileException() {
    }

    public FileException(String message) {
        super(message);
    }

    public FileException(String message, Throwable cause) {
        super(message, cause);
    }
}

```
创建service接口
```java

import java.util.List;

public interface IFileService {

    /**
     * 插入文件信息
     *
     * @param fileResources 文件信息
     * @return 操作结果
     */
    public int insertFileInfo(FileResources fileResources);
    /**
     * 获取用户文件信息
     *
     * @param userId 用户id
     * @return 操作结果
     */
    public List<FileResources> getUserFile(long userId, String fileType);
}

```
创建service类,
```java

import com.live.applet.common.utils.file.ReadFilePath;
import com.live.applet.file.domain.FileResources;
import com.live.applet.file.exception.FileException;
import com.live.applet.file.mapper.FileResourcesMapper;
import com.live.applet.file.service.IFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;

@Service
public class FileServiceImpl implements IFileService {

    private final Path fileStorageLocation; // 文件在本地存储的地址
    private final FileResourcesMapper fileResourcesMapper;

    @Autowired
    public FileServiceImpl(ReadFilePath filePath, FileResourcesMapper fileResourcesMapper) {
        this.fileStorageLocation = Paths.get(filePath.getUploadDir()).toAbsolutePath().normalize();
        this.fileResourcesMapper=fileResourcesMapper;
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * 存储文件到系统
     *
     * @param file 文件
     * @return 文件名
     */
    public String storeFile(MultipartFile file) {
        // Normalize file name
        String fileName = System.currentTimeMillis()+"_"+StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            // Check if the file's name contains invalid characters
            if(fileName.contains("..")) {
                throw new FileException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new FileException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    /**
     * 加载文件
     * @param fileName 文件名
     * @return 文件
     */
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {
                return resource;
            } else {
                throw new FileException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new FileException("File not found " + fileName, ex);
        }
    }

    @Override
    public int insertFileInfo(FileResources fileResources) {
        return fileResourcesMapper.insertFileInfo(fileResources);
    }

    @Override
    public List<FileResources> getUserFile(long userId, String fileType) {
        FileResources fileResources=new FileResources();
        fileResources.setUserId(userId);
        fileResources.setFileType(fileType);
        return fileResourcesMapper.getUserFile(fileResources);
    }
}
```
创建controller  
tips:`this::uploadFile`报错可能是接受的参数不匹配
```java

import com.live.applet.common.utils.AjaxResult;
import com.live.applet.file.domain.FileResources;
import com.live.applet.file.service.impl.FileServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Objects;

@RestController
@Slf4j
public class FileController {

    private final FileServiceImpl fileService;
    @Autowired
    public FileController(FileServiceImpl fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/uploadFile")
    public AjaxResult uploadFile(@RequestParam("file") MultipartFile file,@RequestParam("userId") long userId){
        String fileName = fileService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();
        String fileType;
        if(Objects.requireNonNull(file.getContentType()).contains("image")){
            fileType="0";
        }else if(Objects.requireNonNull(file.getContentType()).contains("video")){
            fileType="1";
        }else{
            fileType="-1";
        }
        FileResources fileResources=new FileResources(fileName, file.getContentType(), fileType, file.getSize(), fileDownloadUri,userId);
        if(fileService.insertFileInfo(fileResources)>0){
            return AjaxResult.success();
        }else{
            return AjaxResult.error();
        }
    }
    // 暂时无用
//    @PostMapping("/uploadMultipleFiles")
//    public AjaxResult uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
//        List<FileResources> fileResourcesList=Arrays.stream(files)
//                .map(this::uploadFile)
//                .collect(Collectors.toList());
//        return AjaxResult.success(fileResourcesList);
//    }
    @PostMapping("/getUserFile")
    public AjaxResult getUserFile(@RequestParam("userId") long userId,@RequestParam("fileType")String fileType){
        return AjaxResult.success(fileService.getUserFile(userId,fileType));
    }
    @GetMapping("/downloadFile/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            log.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
```