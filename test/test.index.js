/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var expect = require('chai').expect;
var Marshal = require('../src/index.js');

describe('测试文件', function () {

    it('object', function () {
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


    it('array', function () {
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


    it('null', function () {
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

    it('anonymous function', function () {
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
        var ret = Marshal(data, fields);
        var to = {
            title: '西安、腾冲、瑞丽双飞六日780元',
            itineraryState: "上架中",
            media_info: "驴管家",
            source: '驴管家'
        };
        expect(ret).to.deep.equal(to);
    });

    it('envelope', function () {
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

});

