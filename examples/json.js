/**
 * json 数据整理
 * @author slanxy
 * @create 2016-11-10
 */
'use strict';


var index = require('../src/index.js');

/**
 * 自定义元数据转换器
 * @type {*|void}
 */
var Sex = index.Raw.extend({
    constructor: function (defaults, attribute) {
        Sex.parent(this, defaults, attribute);
    },
    format: function (value) {
        if (value == 0)
            return "男";

        else if(value == 1)
            return "女";

        return "未知";
    }
});

// 字段列表
var fields = {
    'fUserId': index.String,
    'fNickName': index.String,
    'fSexLabel': new Sex(null, 'fSex'),
    'fSex': index.Integer,
    'friends': {
        'fUserId': index.String,
        'fNickName': index.String,
        'fSex': index.Integer,
        'fSexLabel': new Sex(null, 'fSex')
    }
};

// 原始数据
var data = {
    'fUserId': "001",
    'fNickName': "郑贤森",
    'fSex': 0,
    // 'friends': [
    //     {
    //         'fUserId': "001",
    //         'fNickName': "郑某人",
    //         'fSex': 0
    //     }
    // ]
};

// 整理数据
console.log(
    index.marshal(data, fields)
);
