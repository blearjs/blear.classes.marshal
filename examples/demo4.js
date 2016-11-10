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
    'country': new Marshal.String('其他', 'assemblyAddress.countryName'),
    'assemblyAddress': (value) => {
        return value['provinceName'] + value['cityName'];
    }
};

// 原始数据
var data = {
    "title": "西安、腾冲、瑞丽双飞六日780元",
    "assemblyAddress": {
        "countryName": "中国",
        "provinceName": "云南",
        "cityName": "怒江",
        "detailAddress": "咋不飞天村"
    }
};

// 整理数据
console.log(
    Marshal(data, fields)
);
