module.exports.formatCity = (city) => {
    // console.log("city:" + city);
    return city.replace(/台/g, '臺');
}


module.exports.temperatureColor = (minT, maxT) => {
    // console.log("city:" + city);
    const temperature = (Number(minT) + Number(maxT)) / 2;

    if (temperature >= 35) {
        return "#72030A";
    } else if (temperature >= 30 && temperature < 35) {
        return "#EE1559";
    } else if (temperature >= 30 && temperature < 35) {
        return "#EE1559";
    } else if (temperature >= 25 && temperature < 30) {
        return "#E88C25";
    } else if (temperature >= 20 && temperature < 25) {
        return "#F0F4C2";
    } else if (temperature >= 15 && temperature < 20) {
        return "#86C773";
    } else if (temperature >= 10 && temperature < 15) {
        return "#0E9048";
    } else if (temperature >= 5 && temperature < 10) {
        return "#A4E0EB";
    } else if (temperature < 5) {
        return "#0D7286";
    }
    return "E88C25";
}
