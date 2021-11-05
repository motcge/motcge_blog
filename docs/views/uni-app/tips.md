---
title: "uni-app常用小技巧"
date: 2021-11-03
tags:
- 小技巧
- uni-app
categories:
- 小技巧
isShowComments: false
---
### 表单验证
微信小程序表单验证需要在onReady中绑定

```js
onReady() {
    // 需要在onReady中设置规则
    this.$refs.form.setRules(this.rules)
},
```

需要注意的是**要在绑定的表单中写明数据项的名字!!** 否则不起作用或验证错误,重置表单的时候也千万要注意