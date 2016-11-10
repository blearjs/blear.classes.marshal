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
    'itineraryState': (value) => {
        switch (value) {
            case 0:
                return "审核中";

            case 1:
                return "上架中";

            case 2:
                return "已下架";
        }
        return "上架失败";
    }
};

// 原始数据
var data = {
    "title": "西安、腾冲、瑞丽双飞六日780元",
    "itineraryState": 1
};

// 整理数据
console.log(
    Marshal(data, fields)
);
