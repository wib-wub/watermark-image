const watermark = require('../app');
const {sample, watermark: watermarkSample} = require('./assets.json');
test('Core function should correctly', async () => {
	const options = {
		fontSize: 8,
		opacity: 0.5,
		ratio: 1,
	};
	expect(await watermark(sample, watermarkSample, options)).toBeTruthy();
});
