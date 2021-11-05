---
title: "Vue常用小技巧"
date: 2021-11-03
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



### form相关
#### 1.从后端获取数据后,form无法被修改

可能原因:  
Vue无法对后续添加的对象属性做出正常响应;vue无法对对象属性的添加和删除做出响应  

解决方法:  
1.使用forceUpdate进行强制更新(较为繁琐,不推荐)  
在input的属性中加入`@input="$forceUpdate()"`进行强制更新

2.使用Vue官方推荐的, Object.assign() 或 _.extend()方法  
Object.assign(): 方法用于将所有可枚举属性的值从一个或多个源对象source复制到目标对象。它将返回目标对象  

_语法_`Object.assign(target, ...sources)`  
_例子_
```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const returnedTarget = Object.assign(target, source);
// 此时returnedTarget与target指向同一个对象{ a: 1, b: 4, c: 5 },为浅拷贝
```

#### 2.数据校验项有值却仍提示为空的问题

可能的原因:  
form-item的prop参数与被校验的表单及rules中的参数,参数名不统一的原因

解决方法:  
统一参数名



#### ?.vue给对象赋值无效的问题

可能的原因:  
chrome版本问题

解决方法:  
可以使用edge进行调试看看,如果的确是版本问题,建议对属性进行单个赋值,也可以尝试对象克隆  



