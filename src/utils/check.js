const axios = require('axios');

// 檢查url是否有效
module.exports.checkUrl = async function (url) {
    try {
        await axios.head(url);
        return true;
    } catch (error) {
        if (error.response.status >= 400) {
            return false;
        }
    }
};


// 根據某個欄位加總
module.exports.groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        result[currentValue[key]] = (result[currentValue[key]] || 0) + 1;
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
    }, {}); // empty object is the initial value for result object
};


