const URL = require('../settings/url');
const format = require('../utils/format');
const check = require('../utils/check');
const axios = require('axios');

// 空氣品質
module.exports = async function getAQI(context) {
    let city = context.event.text.toUpperCase().replace('AQI', '').trim();
    city = format.formatCity(city);

    const aqiResult = await axios.get(URL.AQI);

    let aqiData = [];
    if (city.length > 0) {
        aqiData = aqiResult.data.filter(aqi => aqi.SiteName.includes(city) || aqi.County.includes(city));
    } else {
        const contries = [...new Set(aqiResult.data.map(item => item.County))];
        contries.forEach(county => {
            aqiData.push(aqiResult.data.find(aqi => aqi.County == county));
        });
    }

    if (aqiData.length > 0) {
        await composeFlexMessage(context, aqiData);
    } else {
        await context.sendText("請輸入正確縣市資料");
    }
}

async function composeFlexMessage(context, aqiData) {
    //console.log(JSON.stringify(aqiData));

    const groupByCounty = check.groupBy(aqiData, 'County');
    //console.log(JSON.stringify(groupByCounty));
    //console.log(Object.entries(groupByCounty).length);

    // 將raw data取出想要的欄位
    const AqiObject = aqiData.map(({ SiteName, County, AQI, Status, Pollutant }) => ({
        type: 'box',
        layout: 'horizontal',
        contents: [
            {
                type: 'text',
                text: (Object.entries(groupByCounty).length > 1 ? `${County}-${SiteName}` : SiteName) + ` AQI:${AQI} ${Status} ${Pollutant}`,
                size: 'md',
                weight: 'bold',
                flex: 0,
                color: ((AQI <= 50) ? '#33C02B' : // 良好
                    (AQI <= 100) ? '#FFFF00' :    // 中等
                        (AQI <= 150) ? '#FF4500' :// 警示
                            '#FF3C20'),           // 危險
            },
            ... (Object.entries(groupByCounty).length > 1 ? // 沒有輸入城市, 會有明細按鈕
                [{
                    type: 'button',
                    style: 'link',
                    action: {
                        type: 'message',
                        label: '明細',
                        text: `AQI ${County}`
                    },
                    margin: 'xs',
                    gravity: 'center',
                    height: 'sm',
                }] : [])
        ],
        margin: 'lg',
        alignItems: 'center'
    }));

    // 產生flex message格式
    const flexMessage = {
        type: 'bubble',
        size: Object.entries(groupByCounty).length > 1 ? 'giga' : 'mega',
        styles: {
            body: {
                'backgroundColor': '#1E1E1E'
            },
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [{
                type: 'text',
                text: 'AQI 空氣品質',
                weight: 'bold',
                align: 'center',
                size: 'xl',
                color: '#ffffff'
            }, ...AqiObject]
        }
    };

    //console.log(JSON.stringify(flexMessage));
    await context.sendFlex('AQI 空氣品質', flexMessage);
}