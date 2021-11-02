---
title: "Vue常用小技巧"
date: 2021-11-02
tags:
- 小技巧
categories:
- 小技巧
isShowComments: false
---

### this相关
1. 在 data() 定义的函数中使用this调用其他属性和方法  

在data()中可能会定义一些函数，这些函数如果使用普通的方式去声明时，this是undefined，  
并不能调用在data()中声明的 其他属性  
如果想调用其他的属性，需要使用箭头函数即 () => {}

2. 