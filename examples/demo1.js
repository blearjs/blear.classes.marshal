/**
 * json 数据DEMO
 * @author slanxy
 * @create 2016-11-10
 */
'use strict';


var Marshal = require('../src/index.js');

// 字段列表
var fields = {
    'title': Marshal.String,
    'cover': Marshal.String,
    'days': Marshal.Integer,
    'distEndDays': Marshal.Integer
};

// 原始数据
var data = {
    "title": "11月1日起天天发：西安、腾冲、瑞丽双飞六日780元（全包。价格根据季节有上浮）",
    "cover": "http://img.lv-guanjia.com/2016092918014501pptkwh.jpg",
    "days": 6,
};

// 整理数据
console.log(
    Marshal(data, fields)
);
