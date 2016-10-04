# Challenge
**简单的多题库答题系统**

DEMO:[点我进入](http://lab.konge.pw/challenge/)

[![PHP VERSION](https://img.shields.io/badge/PHP-5.4+-green.svg?maxAge=2592000)]()

>需要

> 1. PHP5.4+

> 2. mcrypt

##食用方法

1.修改 $rawKey (可以滚键盘), 每次修改需同时修改 $version 使前端自动更新key

2.将题目文件放入 /questions, 文件名为 题库名+'.php' (不包含双引号).

格式:
```php
<?php
$question=[
  ['题目0','答案0'],
  ['题目1','答案1'],
  //...
  ['答完了',[1]] //防止越界
];
```

3.愉快地玩耍
