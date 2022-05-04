const { router, text } = require('bottender/router');
const URL = require('./settings/url');
const RadarEcho = require('./actions/RadarEcho');
const Satellite = require('./actions/Satellite');
const Temperature = require('./actions/Temperature');
const AQI = require('./actions/AQI');
const Rain = require('./actions/Rain');
const Forecast = require('./actions/Forecast');
const UVI = require('./actions/UVI');

var CronJob = require('cron').CronJob;

const { getClient } = require('bottender');
const client = getClient('line');

new CronJob('0 40 11 * * *', async () => {
  console.log("job start");
  const dailyForecastData = await Forecast.DailyForecastData();
  //console.log(`userid:${process.env.USER_ID}`);
  // TODO multicastFlex
  await client.pushFlex(process.env.USER_ID, '天氣預報', dailyForecastData);
}, null, true);

module.exports = function App(context) {
  context.getUserProfile().then((profile) => {
    console.log(profile);
  });

  return router([
    text(/^雷達.*$/i, RadarEcho),
    text(/^AQI.*$/i, AQI),
    text(/^雨量.*$/i, Rain),
    text(/^衛星.*$/i, Satellite),
    text(/^(溫度|氣溫).*$/i, Temperature),
    text(/^(UVI|紫外線).*$/i, UVI),
    text(/^([天氣]?)預報.*$/i, Forecast),
    text(/^.*$/i, () => {
      context.sendText(context.event.text);
    })
  ]);
};