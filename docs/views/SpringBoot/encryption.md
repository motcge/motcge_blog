---
title: "Spring常用加密"
date: 2021-11-05
tags:
- Spring
- 加密
categories:
- 
isShowComments: false
---
### MD5加盐加密

实现起来较为简单  
```java
import org.springframework.util.DigestUtils;
// p2为盐
public class Md5SaltUtil {
    public static String getMd5Str(String p1,String p2){
        String temp=p1+p2.substring(0,4);
        return DigestUtils.md5DigestAsHex(temp.getBytes());
    }
}
```