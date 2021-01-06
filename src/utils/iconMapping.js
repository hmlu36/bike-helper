

module.exports.getIcon = (starTime, endTime, weatherCode) => {    
    // 白天 
    // day-clear https://i.imgur.com/5OD9FSQ.jpg
    // day-cloudy https://i.imgur.com/oJSkIwG.jpg
    // day-cloudy-fog https://i.imgur.com/hlGziBs.jpg
    // day-fog https://i.imgur.com/hsl5pZ0.jpg
    // day-partially-clear-with-rain https://i.imgur.com/7GWsW3B.jpg
    // day-snowing https://i.imgur.com/B6liFZV.jpg
    // day-thunderstorm https://i.imgur.com/YY2Xmzf.jpg

    // 晚上
    // night-clear https://i.imgur.com/I82pz96.jpg
    // night-cloudy https://i.imgur.com/moIDyM6.jpg
    // night-cloudy-fog https://i.imgur.com/elEh0gF.jpg
    // night-fog https://i.imgur.com/zUYxlhN.jpg
    // night-partially-clear-with-rain https://i.imgur.com/fmqvcYE.jpg
    // night-snowing https://i.imgur.com/2HwofvW.jpg
    // night-thunderstorm https://i.imgur.com/qwQ4ia1.jpg

    const weatherTypes = {
        thunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
        clear: [1],
        cloudyFog: [25, 26, 27, 28],
        cloudy: [2, 3, 4, 5, 6, 7],
        fog: [24],
        partiallyClearWithRain: [8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39],
        snowing: [23, 37, 42],
    };

    // 假設從 API 取得的天氣代碼是 1
    const currentWeatherCode = 1;

    // 使用迴圈來找出該天氣代碼對應到的天氣型態
    const [weatherType] = Object.entries(weatherTypes).find(weatherType => {
        //console.log(JSON.stringify(weatherType[1]));
        if (weatherType[1].includes(Number(weatherCode))) {
            return weatherType[0];
        }
    }) || [];

    //console.log("weatherCode:" + weatherCode + ", weatherType:" + weatherType + ', startTime:' + starTime + ', endTime:' + endTime);
    const dayIcon = {
        'clear': 'https://i.imgur.com/P1ElMH4.jpg',
        'cloudy': 'https://i.imgur.com/oJSkIwG.jpg',
        'cloudyFog': 'https://i.imgur.com/hlGziBs.jpg',
        'fog': 'https://i.imgur.com/hsl5pZ0.jpg',
        'partiallyClearWithRain': 'https://i.imgur.com/7GWsW3B.jpg',
        'snowing': 'ttps://i.imgur.com/B6liFZV.jpg',
        'thunderstorm': 'https://i.imgur.com/YY2Xmzf.jpg',
    };
    const nightIcon = {
        'clear': 'https://i.imgur.com/I82pz96.jpg',
        'cloudy': 'https://i.imgur.com/moIDyM6.jpg',
        'cloudyFog': 'https://i.imgur.com/elEh0gF.jpg',
        'fog': 'https://i.imgur.com/zUYxlhN.jpg',
        'partiallyClearWithRain': 'https://i.imgur.com/fmqvcYE.jpg',
        'snowing': 'https://i.imgur.com/2HwofvW.jpg',
        'thunderstorm': 'https://i.imgur.com/qwQ4ia1.jpg',
    };

    // 白天
    if (Number(starTime) >= 6 && Number(starTime) < 18) {
        //console.log('day');
        return dayIcon[weatherType];
    } else /*if (Number(starTime) == 18 && Number(endTime) == 6)*/ {
        // 晚上
        //console.log('night');
        return nightIcon[weatherType];
    }
    return 'https://i.imgur.com/P1ElMH4.jpg';
}
