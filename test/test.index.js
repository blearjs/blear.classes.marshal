/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var expect = require('chai').expect;
var Marshal = require('../src/index.js');

describe('测试文件', function () {
    it('base', function () {
        /**
         * 自定义元数据转换器
         * @type {*|void}
         */
        var Sex = Marshal.Raw.extend({
            constructor: function (defaults, attribute) {
                Sex.parent(this, defaults, attribute);
            },
            format: function (value) {
                if (value == 0)
                    return "男";

                else if (value == 1)
                    return "女";

                return "未知";
            }
        });

        // 字段列表
        var fields = {
            'fUserId': Marshal.String,
            'fNickName': Marshal.String,
            'fSexLabel': new Sex(null, 'fSex'),
            'fSex': Marshal.Integer,
            'friends': {
                'fUserId': Marshal.String,
                'fNickName': Marshal.String,
                'fSex': Marshal.Integer,
                'fSexLabel': new Sex(null, 'fSex')
            }
        };

        // 原始数据
        var data = {
            'fUserId': "001",
            'fNickName': "郑贤森",
            'fSex': 0,
            'friends': [
                {
                    'fUserId': "001",
                    'fNickName': "郑某人",
                    'fSex': 0
                }
            ]
        };

        // 整理数据
        var ret = Marshal(data, fields)
        var to = {
            fUserId: '001',
            fNickName: '郑贤森',
            fSexLabel: '男',
            fSex: 0,
            friends: [{fUserId: '001', fNickName: '郑某人', fSex: 0, fSexLabel: '男'}]
        };

        expect(ret).to.deep.equal(to);
    });
});

