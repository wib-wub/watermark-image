const Jimp = require('jimp');

const Size = {
	1: Jimp.FONT_SANS_8_BLACK,
	2: Jimp.FONT_SANS_14_BLACK,
	3: Jimp.FONT_SANS_16_BLACK,
	4: Jimp.FONT_SANS_32_BLACK,
	5: Jimp.FONT_SANS_64_BLACK,
	6: Jimp.FONT_SANS_128_BLACK,
};

Object.freeze(Size);

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
 * @param options.text [object]
 * @param {string} [options.text.message] - message
 * @param {number} [options.text.size] - size of message 1 - 6
 * @params {string} [options.text.position] - position that include top-left, top-right , bottom-left and bottom-right - default is bottom-right
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


		if (options.text) {
			if(options.text && options.text.size && options.text.message && typeof options.text.size === 'number' && typeof options.text.message === 'string') {
				const font = await Jimp.loadFont(Size[options.text.size]);
				let x = inputEntity.getWidth() - (inputEntity.getWidth() * 0.15);
				let y = inputEntity.getHeight() - (inputEntity.getWidth() * 0.12);
				if (options.text && options.text.position) {
					if (options.text.position === 'bottom-left') {
						x = options.text.message.length <= 7 ? 30 : 100;
						y = inputEntity.getHeight() - (inputEntity.getWidth() * 0.12);
					} else if (options.text.position === 'top-left') {
						x = options.text.message.length <= 7 ? 30 : 100;
						y = 15;
					} else if (options.text.position === 'top-right') {
						x = inputEntity.getWidth() - (inputEntity.getWidth() * 0.15);
						y = 15;
					}
				}
				await inputEntity.print(font, x, y, {
					text: options.text.message,
					alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
					alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
				}, 200);
			}else {
				throw new Error('Invalid Argument of options.text');
			}
		}
		await watermarkEntity.resize(newWidth, newHeight);
		await watermarkEntity.opacity(options.opacity);
		await inputEntity.composite(watermarkEntity, positionX, positionY);
		return await inputEntity.getBase64Async(Jimp.MIME_PNG);
	} catch (e) {
		throw e;
	}
}

module.exports = addWaterMark;
