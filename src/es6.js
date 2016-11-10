"use strict";

const toString = Object.prototype.toString;

/**
 * 基础数据格式
 * @constructor
 */
class Raw {
    /**
     * 构造函数
     * @param defaults
     * @param attribute
     */
    constructor(defaults, attribute) {
        this.defaults = defaults;
        this.attribute = attribute;
    }

    output(key, obj) {
        // 获取值
        let value = _get_value(this.attribute ? this.attribute : key, obj);

        // 因为有些时候是需要null的，所以不能全部改成默认值
        if (typeof value === 'undefined')
            value = this.defaults;

        return this.format(value)
    }

    format(value) {
        return value;
    }
}

/**
 * 字符型数据
 * @constructor
 */
class Str extends Raw {
    format(value) {
        try {
            return (value || '') + '';

        } catch (ex) {

            throw MarshallingException(ex);
        }
    }
}

/**
 * 整数型数据
 * @constructor
 */
class Integer extends Raw {
    format(value) {
        try {
            // 转成数字
            value = parseInt(value + 0);

            // 判断是否非数字
            if (isNaN(value)) {
                return 0;
            }
            return value

        } catch (ex) {
            throw MarshallingException(ex)
        }
    }
}

/**
 * 浮点型数据
 * @constructor
 */
class Float extends Raw {
    // pass
}

/**
 * 布尔型数据
 * @constructor
 */
class Bool extends Raw {
    format(value) {
        return Boolean(value);
    }
}

/**
 * 数组型数据
 * @constructor
 */
class List extends Raw {
    // pass
}

/**
 * 浮点型数据
 * @constructor
 */
class Dict extends Raw {
    // pass
}

/**
 * 日期时间型数据
 * @class
 */
class DateTime extends Raw {
    // pass
}

/**
 * 格式化字符串
 * @class
 */
class FormattedString extends Raw {
    // pass
}


/**
 * 数据珍惜
 * @class
 */
class Marshal {
    /**
     * 整理数据
     * @param data {Object|Array|JSON} 需要整理的数据
     * @param fields {Object} 字段
     * @param envelope {String} 需要在外部包裹的key
     * @returns {*}
     */
    constructor(data, fields, envelope) {
        let items, value, field;

        if (data instanceof Array) {

            // 如果数据是数组
            items = Marshal.mapArray(data, fields);

        } else if (isPlanObject(data)) {
            //
            items = {};

            // 遍历字段
            for (field in fields) {
                if (fields.hasOwnProperty(field)) {
                    // 获取子项目
                    value = fields[field];

                    if (value instanceof Raw || isFunction(value)) {

                        // 获取元信息
                        let meta = Marshal.makeMeta(value);

                        // 写入内容
                        items[field] = meta.output(field, data);

                    } else if (isPlanObject(value)) {

                        items[field] = new Marshal(data[field], value);

                    } else {
                        items[field] = value;
                    }
                }
            }
        } else {
            return null;
        }
        return envelope ? Marshal.makeDict(envelope, items) : items;
    }

    static makeDict(envelope, data) {
        let obj = {};
        obj[envelope] = data;
        return obj;
    }

    /**
     *
     * @param data
     * @param fields
     * @returns {*}
     */
    static mapArray(data, fields) {
        return data.map((d) => {
            return new Marshal(d, fields);
        });
    }

    /**
     *
     * @param cls
     * @returns {*}
     */
    static makeMeta(cls) {
        if (isFunction(cls)) {
            // es6写法的函数没有prototype 囧~~~
            if (cls.prototype && isFunction(cls.prototype.output))
                return new cls();

            return {
                output: (field, data) => {
                    return cls(_get_value(field, data));
                }
            };
        }

        return cls
    }
}


function isPlanObject(obj) {
    return toString.call(obj) == "[object Object]";
}

function isFunction(obj) {
    return typeof obj === 'function';
}


function _get_value_for_key(key, obj) {
    try {
        return obj[key];
    } catch (ex) {
        console.log(ex)
    }
}


function _get_value_for_keys(keys, obj) {
    if (keys.length === 1) {
        return _get_value_for_key(keys[0], obj);
    }

    let value = _get_value_for_key(keys.shift(), obj);

    if (typeof value !== 'undefined')
        return _get_value_for_keys(keys, value)
}


function _get_value(key, obj) {
    if (isFunction(key)) {
        return key(obj);
    } else {
        return _get_value_for_keys((key + '').split('.'), obj)
    }
}


function MarshallingException(Exception) {
    // pass
}


// 导出
module.exports = {Raw, Str, Dict, List, Integer, Bool, DateTime, FormattedString, Marshal};
