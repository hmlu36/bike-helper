// 現在時間
module.exports.getCurrentTime = function () {
    let now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 8));
};

// 日期轉文字
module.exports.date2yyyyMMdd = function (date) {
    return date.toISOString().slice(0, 10);
};


// 日期轉文字
module.exports.date2yyyyMMddHHMM = function (date) {
    return this.date2yyyyMMdd(date).replace(/-/g, '') +
        [(date.getHours() > 9 ? '' : '0') + date.getHours(), Math.floor(date.getMinutes() / 10) + '0'].join('');
};

// 日期轉文字
module.exports.date2yyyy_MM_dd_HH_MM = function (date) {
    return this.date2yyyyMMdd(date) + '-' +
        [(date.getHours() > 9 ? '' : '0') + date.getHours(), Math.floor(date.getMinutes() / 10) + '0'].join('-');
};


module.exports.date2yyyy_MM_dd_HHMM = function (date) {
    return this.date2yyyyMMdd(date) + '_' +
        [(date.getHours() > 9 ? '' : '0') + date.getHours(), (date.getMinutes() > 9 ? '' : '0') + date.getMinutes()].join('');
};


// 日期轉文字
module.exports.date2yyyyMMddHH = function (date) {
    return this.date2yyyyMMdd(date).replace(/-/g, '') +
        [(date.getHours() > 9 ? '' : '0') + date.getHours() + '0'].join('');
};

