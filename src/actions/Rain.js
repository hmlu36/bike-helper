const URL = require('../settings/url');
const date = require('../utils/date');
const check = require('../utils/check');

// 取得雷達迴波路徑(計算10分鐘前, 氣象局會產生10分鐘前資料)
module.exports = async function getRainfall(context) {
    let currentTime = date.getCurrentTime();
    let rainfullTimeStr = "";
    let urlExist = false;
    let url;
    const minute = currentTime.getMinutes();
    currentTime = new Date(currentTime - 60000 * ((minute > 30) ? (minute - 30) : minute));
    

    // 比對取30分鐘前資料, 取不到再取前30分鐘
    while (!urlExist) {
        // 取不到往前30分鐘
        if (rainfullTimeStr.length > 0) {
            currentTime = new Date(currentTime - 60000 * 30);
        }

        rainfullTimeStr = date.date2yyyy_MM_dd_HHMM(currentTime);
        url = URL.RAIN.replace("${dateStr}", rainfullTimeStr);

        console.log('rainfullTimeStr:' + rainfullTimeStr + ', url:' + url);

        urlExist = await check.checkUrl(url);
    }

    await context.sendImage({
        originalContentUrl: url,
        previewImageUrl: url,
    });
};
