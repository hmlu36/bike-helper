const URL = require('../settings/url');
const date = require('../utils/date');
const check = require('../utils/check');

// 取得雷達迴波路徑(計算10分鐘前, 氣象局會產生10分鐘前資料)
module.exports = async function getRadarEcho(context) {
    let currentTime = date.getCurrentTime();
    let satelliteTimeStr;
    let urlExist = false;
    let url;

    // 比對取10分鐘前資料, 取不到再取前10分鐘
    while (!urlExist) {
        // zone time utc+8 - 10minutes
        currentTime = new Date(currentTime - 60000 * 10);
        satelliteTimeStr = date.date2yyyy_MM_dd_HH_MM(currentTime);
        url = URL.SATELLITE + `${satelliteTimeStr}.jpg`;
        console.log('satelliteTimeStr:' + satelliteTimeStr + ', url:' + url);

        urlExist = await check.checkUrl(url);
    }

    await context.sendImage({
        originalContentUrl: url,
        previewImageUrl: url,
    });
};
