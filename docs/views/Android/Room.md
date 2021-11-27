---
title: "Android Room的使用"
date: 2021-11-12
tags:
- Android
- Room
categories:
- 
isShowComments: false
---

## Android Room的使用

Room是Google提供的一个ORM库。Room提供了三个主要的组件：  

+ @Database：@Database用来注解类，并且注解的类必须是继承自`RoomDatabase`的抽象类。该类主要作用是创建数据库和创建Daos（data access objects，数据访问对象）
+ @Entity：@Entity用来注解实体类，@Database通过entities属性引用被@Entity注解的类，并利用该类的所有字段作为表的列名来创建表。
+ @Dao：@Dao用来注解一个接口或者抽象方法，该类的作用是提供访问数据库的方法。在使用@Database注解的类中必须定一个不带参数的方法，这个方法返回使用@Dao注解的类。

