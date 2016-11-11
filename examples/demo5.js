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
    },
    'media_info': new Marshal.String('未知', (value) => {
        return value.author;
    }),
    'source': '驴管家'
};

// 原始数据
var data = {
    title: "西安、腾冲、瑞丽双飞六日780元",
    itineraryState: 1,
    media_info: {
        author: '驴管家'
    }
};

// 整理数据
console.log(
    Marshal(data, fields)
);