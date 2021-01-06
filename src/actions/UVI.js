const URL = require('../settings/url');

module.exports = async function GetUVI(context) {
    await context.sendImage({
        originalContentUrl: URL.UVI,
        previewImageUrl: URL.UVI,
    });
};