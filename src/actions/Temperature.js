const URL = require('../settings/url');
const date = require('../utils/date');
const check = require('../utils/check');

// 取得雷達迴波路徑(計算10分鐘前, 氣象局會產生10分鐘前資料)
module.exports = async function getRadarEcho(context) {
    let currentTime = date.getCurrentTime();
    let temperatureTimeStr = "";
    let urlExist = false;
    let url;
    const minute = currentTime.getMinutes();
    currentTime = new Date(currentTime - 60000 * minute);

    // 取整點的資料, 取不到再取前一小時
    while (!urlExist) {
        // 取不到往前30分鐘
        if (temperatureTimeStr.length > 0) {
            currentTime = new Date(currentTime - 60000 * 60);
        }
        temperatureTimeStr = date.date2yyyy_MM_dd_HHMM(currentTime);
        url = URL.TEMPERATURE.replace('${dateStr}', `${temperatureTimeStr}`);
        console.log('temperatureTimeStr:' + temperatureTimeStr + ', url:' + url);

        urlExist = await check.checkUrl(url);
    }

    await context.sendImage({
        originalContentUrl: url,
        previewImageUrl: url,
    });
};
