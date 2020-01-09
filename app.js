const Jimp = require('jimp');

/**
 *
 * @param {number} H - base image height
 * @param {number} W - base image width
 * @param {number} h - watermark image height
 * @param {number} w - watermark image width
 * @param {number} ratio
 * @returns {number[]} - dimensions
 */
function getDimensions(H, W, h, w, ratio) {
	let hh, ww;
	if ((H / W) < (h / w)) {
		hh = ratio * H;
		ww = hh / h * w;
	} else {
		ww = ratio * W;
		hh = ww / w * h;
	}
	return [hh, ww];
}

/**
 *
 * @param {string} image - base image base64 string
 * @param {string} waterMark - base64 string watermark image
 * @param options
 * @param {number} options.ratio
 * @param {number} options.opacity
 * @returns {Promise<string>} - base64 string image with watermark
 */
async function addWaterMark(image, waterMark, options) {
	// eslint-disable-next-line no-useless-catch
	try {
		const base64 = Buffer.from(image, 'base64');
		const waterMarkBase64 = Buffer.from(waterMark, 'base64');
		const watermarkEntity = await Jimp.read(waterMarkBase64);
		const inputEntity = await Jimp.read(base64);
		const [newHeight, newWidth] = getDimensions(
			inputEntity.getHeight(),
			inputEntity.getWidth(),
			watermarkEntity.getHeight(),
			watermarkEntity.getWidth(),
			options.ratio,
		);
		const positionX = (inputEntity.getWidth() - newWidth) / 2;
		const positionY = (inputEntity.getHeight() - newHeight) / 2;

		await watermarkEntity.resize(newWidth, newHeight);
		await watermarkEntity.opacity(options.opacity);
		await inputEntity.composite(watermarkEntity, positionX, positionY, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
		return await inputEntity.getBase64Async(Jimp.MIME_PNG);
	} catch (e) {
		throw e;
	}
}

module.exports = addWaterMark;
