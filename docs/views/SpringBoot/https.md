---
title: "配置Https"
date: 2021-11-27
tags:
- Https
- tips
categories:
- 
isShowComments: false
---

### 配置springboot使用https证书

在`application.yml`中写入  
```yml
server:
  ssl:
  # 证书路径,在resources根目录下
    key-store: classpath:khy.pfx
    key-store-password: 0n3L6lIh
    key-store-type: PKCS12
```
* 遇见`java.io.IOException: Alias name [cas] does not identify a key entry`异常  
删除alias配置  
* 遇见`DerInputStream.getLength(): lengthTag=111, too big.`异常  
原因出自maven-resources-plugin,修改以下内容
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-resources-plugin</artifactId>
    <version>2.6</version>
    <configuration><encoding>UTF-8</encoding>
        <nonFilteredFileExtensions>
            <nonFilteredFileExtension>pfx</nonFilteredFileExtension>
        </nonFilteredFileExtensions>
    </configuration>
</plugin>

<resources>
  <resource>
      <directory>src/main/resources</directory>
      <filtering>false</filtering>
      <includes>
          <include>*.pfx</include>
      </includes>
  </resource>
</resources>
```

* 配置http映射  

```java
@Configuration
public class TomcatConfig {
    @Bean
    public ServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        tomcat.addAdditionalTomcatConnectors(createStandardConnector()); // 添加http
        return tomcat;
    }

    /* --------------------请按照自己spring boot版本选择 end--------------------- */


    // 配置http
    private Connector createStandardConnector() {
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setPort(80);
        return connector;
    }
}
```