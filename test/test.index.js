/**
 * mocha 测试 文件
 * @author zxs
 * @create 2016-11-11
 */


'use strict';

var expect = require('chai').expect;
var Marshal = require('../src/index.js');

describe('suit', function () {

    it('test 01', function () {
        // 字段列表
        var fields = {
            'base': {
                'integer': Marshal.Integer,
                'string': Marshal.String,
                'boolean': Marshal.Boolean,
                'object': Marshal.Object,
                'array': Marshal.Array,
                'float': Marshal.Float
            },
            'default': {
                'integer': Marshal.Integer,
                'string': Marshal.String,
                'boolean': Marshal.Boolean,
                'object': Marshal.Object,
                'array': Marshal.Array,
                'float': Marshal.Float
            },
            'string number': {
                'integer': Marshal.Integer,
                'float': Marshal.Float
            },
            'nan': {
                'integer': Marshal.Integer,
                'float': Marshal.Float
            }
        };

        // 原始数据
        var data = {
            'base': {},
            'default': {
                "array": ["string"],
                "boolean": false,
                "float": 1.01,
                "integer": 1,
                "object": {},
                "string": "string"
            },
            'string number': {
                "float": '0.01',
                "integer": '1'
            },
            'nan':  {
                "float": 'nan',
                "integer": 'nan'
            }
        };

        // 整理数据
        var ret = Marshal(data, fields);
        var to = {
            'base': {
                "array": [],
                "boolean": false,
                "float": 0,
                "integer": 0,
                "object": {},
                "string": ""
            },
            'default': {
                "array": ["string"],
                "boolean": false,
                "float": 1.01,
                "integer": 1,
                "object": {},
                "string": "string"
            },
            'string number':  {
                "float": 0.01,
                "integer": 1
            },
            'nan':  {
                "float": 0,
                "integer": 0
            }
        };
        expect(ret).to.deep.equal(to);
    });

    it('test 02', function () {
        // 字段列表
        var fields = {
            id: Marshal.String,
            title: Marshal.String,
            author: new Marshal.String('驴管家', 'media_info.author')
        };

        // 原始数据
        var data = {
            id: 1,
            title: "西安、腾冲、瑞丽双飞六日780元",
            media_info: {
                author: '驴管家'
            }
        };

        // 整理数据
        var ret = Marshal(data, fields);
        var to = {
            id: '1',
            title: '西安、腾冲、瑞丽双飞六日780元',
            author: '驴管家'
        };

        expect(ret).to.deep.equal(to);
    });


    it('test 03', function () {
        // 字段列表
        var fields = {
            title: Marshal.Raw,
            author: new Marshal.String('驴管家', 'source')
        };

        // 原始数据
        var data = [{
            title: "西安、腾冲、瑞丽双飞六日780元"
        }];

        // 整理数据
        var ret = Marshal(data, fields);
        var to = [{
            title: '西安、腾冲、瑞丽双飞六日780元',
            author: '驴管家'
        }];

        expect(ret).to.deep.equal(to);
    });


    it('test 04', function () {
        // 字段列表
        var fields = {
            title: Marshal.Raw,
            author: new Marshal.String('驴管家', 'source')
        };

        // 原始数据
        var data = null;

        // 整理数据
        var ret = Marshal(data, fields);

        expect(ret).to.be.a('null');
    });

    it('test 05', function () {
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
                return value.media_info.author;
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
        var ret = Marshal(data, fields);
        var to = {
            title: '西安、腾冲、瑞丽双飞六日780元',
            itineraryState: "上架中",
            media_info: "驴管家",
            source: '驴管家'
        };
        expect(ret).to.deep.equal(to);
    });


    it('test 06', function () {
        // 字段列表
        var fields = {
            title: Marshal.String,
            media_info: {
                author: Marshal.String
            }
        };

        // 原始数据
        var data = {
            title: "西安、腾冲、瑞丽双飞六日780元",
            media_info: {
                author: '驴管家'
            }
        };

        // 整理数据
        var opts = {envelope: 'result'};
        var ret = Marshal(data, fields, opts);
        var to = {
            result: {
                title: '西安、腾冲、瑞丽双飞六日780元',
                media_info: {
                    author: '驴管家'
                }
            }
        };
        expect(ret).to.deep.equal(to);
    });

    it('test 07', function () {
        // 字段列表
        var fields = {
            title: Marshal.String,
            recommend: {
                news: {
                    title: Marshal.String
                }
            },
            comments: {
                nickname: Marshal.String
            }
        };

        // 原始数据
        var data = {
            title: "西安、腾冲、瑞丽双飞六日780元",
            recommend: {
                news: [{title: '一起嗨吧！'}]
            },
            comments: null
        };

        // 整理数据
        var ret = Marshal(data, fields);
        var to = {
            title: "西安、腾冲、瑞丽双飞六日780元",
            recommend: {
                news: [{title: '一起嗨吧！'}]
            },
            comments: null
        };
        expect(ret).to.deep.equal(to);
    });

});

