const URL = require('../settings/url');
const axios = require('axios');
const format = require('../utils/format');
const countries = require('../settings/countries');
const iconMapping = require('../utils/iconMapping');

// 取得雷達迴波路徑(計算10分鐘前, 氣象局會產生10分鐘前資料)
module.exports = async function getForecast(context) {
  const forecastResult = await axios.get(URL.FORECAST);
  //console.log(JSON.stringify(forecastResult.data.records));

  let city = context.event.text.toUpperCase().replace("預報", "").trim();
  city = format.formatCity(city);

  let forecastData = [];
  // 輸入城市
  if (city.length > 0) {
    forecastData = forecastResult.data.records.location.filter(item => item.locationName.includes(city));
  } else {
    // 未輸入城市
    countries.forEach(county => {
      forecastData.push(forecastResult.data.records.location.find(item => item.locationName == county));
    });
  }

  if (Object.keys(forecastData).length > 0) {
    const cityCount = forecastData.map(item => item.locationName);
    // 輸入城市
    if (Object.entries(cityCount).length == 1) {
      await composeDetailFlexMessage(context, forecastData);
    } else {
      // 為輸入城市(全部列出)
      await composeSummaryFlexMessage(context, forecastData);
    }
  } else {
    await context.sendText("請輸入正確縣市資料");
  }
};


module.exports.DailyForecast = async function () {
  const forecastResult = await axios.get(URL.FORECAST);
  
  let forecastData = [];
  countries.forEach(county => {
    forecastData.push(forecastResult.data.records.location.find(item => item.locationName == county));
  });

  const boxMessage = getSummaryFlexMessage(forecastData);
  // 產生flex message格式
  const flexMessage = {
    type: "carousel",
    contents: [...boxMessage]
  };

  return boxMessage;
}


const getSummaryFlexMessage = (forecastData) => {
  return [...Array(3).keys()].map(index => {
    return {
      type: 'bubble',
      size: 'giga',
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
          text: '天氣預報',
          weight: 'bold',
          align: 'center',
          size: 'xl',
          color: '#ffffff'
        },
        {
          type: 'text',
          text: `${forecastData[0].weatherElement[0].time[index].startTime.substring(5, 13).replace("-", "/")} - ${forecastData[0].weatherElement[0].time[index].endTime.substring(5, 13).replace("-", "/")}`,
          weight: 'bold',
          align: 'center',
          size: 'xl',
          color: '#ffffff'
        }, ...forecastData.map(item => ({
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: item.locationName + " " +
                item.weatherElement.find(el => el.elementName == "CI").time[index].parameter.parameterName +
                " 🌡️" +
                item.weatherElement.find(el => el.elementName == "MinT").time[index].parameter.parameterName + "-" +
                item.weatherElement.find(el => el.elementName == "MaxT").time[index].parameter.parameterName +
                " 🌧️" +
                item.weatherElement.find(el => el.elementName == "PoP").time[index].parameter.parameterName + "%",
              size: 'md',
              weight: 'bold',
              color: format.temperatureColor(item.weatherElement.find(el => el.elementName == "MinT").time[index].parameter.parameterName, item.weatherElement.find(el => el.elementName == "MaxT").time[index].parameter.parameterName)
            }],
          margin: 'lg',
          alignItems: 'center'
        }))]
      }
    };
  });

}
async function composeSummaryFlexMessage(context, forecastData) {
  //console.log(JSON.stringify(forecastData));
  sendCarouselMessage(context, getSummaryFlexMessage(forecastData));
}

async function composeDetailFlexMessage(context, forecastData) {
  //console.log(JSON.stringify(weatherElement));

  // Wx   天氣現象
  // MaxT 最高溫度
  // MinT 最低溫度
  // CI   舒適度
  // PoP  降雨機率
  // 參考 https://opendata.cwb.gov.tw/opendatadoc/MFC/D0047.pdf
  // 轉成key value object
  //var forecastObject = weatherElement.reduce((obj, item) => Object.assign(obj, { [item.elementName]: item.time }), {});
  //console.log(JSON.stringify(forecastData));

  const boxMessage = [...Array(3).keys()].map(index => {
    return {
      type: "bubble",
      styles: {
        header: {
          backgroundColor: "#ffaaaa",
        },
      },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: forecastData[0].locationName,
            size: "lg",
            align: "center",
            weight: "bold"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "image",
                url: iconMapping.getIcon(forecastData[0].weatherElement.find(el => el.elementName == "MinT").time[index].startTime.substring(11, 13),
                  forecastData[0].weatherElement.find(el => el.elementName == "MaxT").time[index].endTime.substring(11, 13),
                  forecastData[0].weatherElement.find(el => el.elementName == "Wx").time[index].parameter.parameterValue),
                size: "start",
                aspectRatio: "140:130",
                size: "xl",
              },
              {
                type: 'text',
                text: forecastData[0].weatherElement.find(el => el.elementName == "Wx").time[index].parameter.parameterName,
                align: "end",
                size: "lg",
                weight: "bold"
              },
            ]
          },
          {
            type: 'text',
            text: forecastData[0].weatherElement.find(el => el.elementName == "Wx").time[index].startTime.substring(0, 13).replace(/-/g, ".") + "時 ~ " + forecastData[0].weatherElement.find(el => el.elementName == "Wx").time[index].endTime.substring(0, 13).replace(/-/g, ".") + "時"
          },
          {
            type: 'text',
            text: "降雨機率：" + forecastData[0].weatherElement.find(el => el.elementName == "PoP").time[index].parameter.parameterName
          },
          {
            type: 'text',
            text: "氣溫：" + forecastData[0].weatherElement.find(el => el.elementName == "MinT").time[index].parameter.parameterName + "~" + forecastData[0].weatherElement.find(el => el.elementName == "MaxT").time[index].parameter.parameterName
          },
        ]
      }
    };
  });

  //console.log(JSON.stringify(boxMessage));

  sendCarouselMessage(context, boxMessage);
}

async function sendCarouselMessage(context, boxMessage) {
  // 產生flex message格式
  const flexMessage = {
    type: "carousel",
    contents: [...boxMessage]
  };

  //console.log(JSON.stringify(flexMessage));
  await context.sendFlex('天氣預報', flexMessage);
}