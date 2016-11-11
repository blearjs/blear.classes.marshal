/**
 * blear.marshal
 * @author slanxy
 * @create 2016-11-10
 */
'use strict';

var Class = require('blear.classes.class');
var typeis = require('blear.utils.typeis');


/**
 * 对外公开的API
 * @param data {*|Object|Array}
 * @param fields {Object} 字段列表
 * @param opts {Object} 可选项 keys: envelope, force
 * @returns {null|Object|Array|JSON}
 */
var Marshal = module.exports = function (data, fields, opts) {
    var items, value, field, meta, json;

    // 可选项
    opts = opts || {};

    if (data instanceof Array) {

        // 如果数据是数组
        items = _make_array(data, fields);

    } else if (typeis.Object(data)) {
        // 生成对象
        items = {};

        // 遍历字段
        for (field in fields) {
            if (fields.hasOwnProperty(field)) {
                // 获取子项目
                value = fields[field];

                // 如果value是元数据处理器或者是一个函数
                if (value instanceof Raw || typeis.Function(value)) {

                    // 获取元信息
                    meta = _make_meta_handle(value);

                    // 写入内容
                    items[field] = meta.output(field, data);

                    // 如果还有子项目需要递归
                } else if (typeis.Object(value)) {
                    // 获取当当前数据的
                    json = data[field];

                    // 如果是对象或数组
                    if (typeis.Object(json) || typeis.Array(json)) {
                        // 递归获取内容
                        items[field] = Marshal(json, value);

                    } else {

                        items[field] = null;
                    }

                    // 其他类型就当做固定数据
                } else {
                    items[field] = value;
                }
            }
        }
    } else {
        return null;
    }

    // 是否需要包裹数据
    return opts['envelope'] ? _make_object(opts['envelope'], items) : items;
};


/**
 * 原始数据
 * @constructor
 */
var Raw = Marshal.Raw = Class.extend({
    /**
     * 构造函数
     * @param defaults
     * @param attribute
     */
    constructor: function (defaults, attribute) {
        // 初始化父类
        Raw.parent(this);

        //noinspection JSUnresolvedVariable
        this.defaults = defaults;
        this.attribute = attribute;
    },

    output: function (key, obj) {
        // 获取值
        var value = _get_value(this.attribute ? this.attribute : key, obj);

        // 因为有些时候是需要null的，所以不能全部改成默认值
        if (typeof value === 'undefined')
            value = this.defaults;

        return this.format(value)
    },

    format: function (value) {
        return value;
    }
});


/**
 * 字符型数据
 * @constructor
 */
Marshal.String = _make_meta_cls(function (value) {
    if (typeis.String(value))
        return value;

    return value + '';
});


/**
 * 整数型数据
 * @constructor
 */
Marshal.Integer = _make_meta_cls(function (value) {
    // 如果是数字
    if (typeis.Number(value))
        return parseInt(value, 10);

    // 转成数字
    value = parseInt(value, 10);

    // 判断是否非数字
    if (isNaN(value)) {
        return 0;
    }
    return value;
});


/**
 * 浮点型数据
 * @constructor
 */
Marshal.Float = _make_meta_cls(function (value) {
    // 如果是数字
    if (typeis.Number(value))
        return value;

    // 转成数字
    value = parseFloat(value);

    // 判断是否非数字
    if (isNaN(value)) {
        return .0;
    }

    return value
});


/**
 * 布尔型数据
 * @constructor
 */
Marshal.Boolean = _make_meta_cls(function (value) {
    // 如果是数字
    if (typeis.Boolean(value))
        return value;

    return Boolean(value);
});


/**
 * 数组型数据
 * @constructor
 */
Marshal.Array = _make_meta_cls(function (value) {
    if (typeis.Array(value))
        return value;

    return [];
});


/**
 * 对象数据
 * @constructor
 */
Marshal.Object = _make_meta_cls(function (value) {
    if (typeis.Object(value))
        return value;

    return {};
});


/**
 * 日期时间型数据
 * @constructor
 */
var DateTime = Marshal.DateTime = Raw.extend({
    constructor: function (defaults, attribute) {
        DateTime.parent(this, defaults, attribute);
    },
    format: function (value) {
        // todo: 后续实现
    }
});


/**
 * 格式化字符串
 * @constructor
 */
var FormattedString = Marshal.FormattedString = Raw.extend({
    constructor: function (defaults, attribute) {
        FormattedString.parent(this, defaults, attribute);
    },
    format: function (value) {
        // todo: 后续实现
    }
});


/**
 * 创建元数据处理器
 * @param cls
 * @returns {*}
 * @private
 */
function _make_meta_handle(cls) {
    if (typeis.Function(cls)) {
        // es6写法的函数没有prototype 囧~~~
        if (cls.prototype && typeis.Function(cls.prototype.output))
            return new cls();

        // 转义下
        return {
            output: function (key, obj) {
                return cls(_get_value(key, obj))
            }
        };
    }

    return cls
}

/**
 * 创建元数据类
 * @param format
 * @returns {*|void}
 * @private
 */
function _make_meta_cls(format) {
    var MetaCls = Raw.extend({
        constructor: function (defaults, attribute) {
            MetaCls.parent(this, defaults, attribute);
        },
        format: format
    });
    return MetaCls;
}

/**
 * 创建对象
 * @param envelope
 * @param data
 * @returns {{}}
 * @private
 */
function _make_object(envelope, data) {
    var obj = {};
    obj[envelope] = data;
    return obj;
}


/**
 * 创建数组
 * @param data
 * @param fields
 * @returns {Array|*}
 * @private
 */
function _make_array(data, fields) {
    return data.map(function (value) {
        return Marshal(value, fields);
    });
}

/**
 * 获取对象中的值
 * @param key {Function|String} 对象或者字符串
 * @param obj {Object} 数据对象
 * @private
 */
function _get_value(key, obj) {
    if (typeis.Function(key)) {
        return key(obj);
    } else {
        return _get_value_for_keys((key + '').split('.'), obj)
    }
}

/**
 * 以keys的方式获取值
 * @param keys {Array} key列表
 * @param obj {Object} 数据对象
 * @private
 */
function _get_value_for_keys(keys, obj) {
    if (keys.length === 1) {
        return _get_value_for_key(keys[0], obj);
    }

    var value = _get_value_for_key(keys.shift(), obj);

    if (typeof value !== 'undefined')
        return _get_value_for_keys(keys, value)
}

/**
 * 获取值
 * @param key {String} 键
 * @param obj {Object} 数据对象
 * @returns {*}
 * @private
 */
function _get_value_for_key(key, obj) {
    try {
        return obj[key];
    } catch (ex) {
        // pass
    }
}
