"use strict";

const settings = {
    refreshMillis: 60000,
    allowPast: true,
    allowFuture: false,
    localeTitle: false,
    cutoff: 0,
    autoDispose: true,
    strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        inPast: 'any moment now',
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
    }
}

function isFunction(obj) {
    return typeof obj === "function";
}


function inWords(distanceMillis) {
    if (!settings.allowPast && !settings.allowFuture) {
        throw 'timeago allowPast and allowFuture settings can not both be set to false.';
    }

    var $l = settings.strings;
    var prefix = $l.prefixAgo;
    var suffix = $l.suffixAgo;
    if (settings.allowFuture) {
        if (distanceMillis < 0) {
            prefix = $l.prefixFromNow;
            suffix = $l.suffixFromNow;
        }
    }

    if (!settings.allowPast && distanceMillis >= 0) {
        return settings.strings.inPast;
    }

    var seconds = Math.abs(distanceMillis) / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var years = days / 365;

    function substitute(stringOrFunction, number) {
        var string = isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
    }

    var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

    var separator = $l.wordSeparator || "";
    if ($l.wordSeparator === undefined) {
        separator = " ";
    }
    return trim([prefix, words, suffix].join(separator));
}

function trim(text) {
    return text == null ?
        "" :
        ( text + "" ).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}

function parse(iso8601) {
    var s = trim(iso8601);
    s = s.replace(/\.\d+/, ""); // remove milliseconds
    s = s.replace(/-/, "/").replace(/-/, "/");
    s = s.replace(/T/, " ").replace(/Z/, " UTC");
    s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
    s = s.replace(/([\+\-]\d\d)$/, " $100"); // +09 -> +0900
    return new Date(s);
}

function distance(date) {
    return (new Date().getTime() - date.getTime());
}

/**
 * 时间转换器
 * @param timestamp
 */
export function timeage(timestamp) {
    let date = null;

    if (timestamp instanceof Date) {
        date = timestamp;
    } else if (typeof timestamp === "string") {

        date = parse(timestamp);

    } else if (typeof timestamp === "number") {
        date = new Date(timestamp);
    } else {
        // pass
    }
    return inWords(distance(date));
}