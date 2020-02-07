# Watermark-image 😎

## Usage

- ``const waterMark = require('watermark-image');``
- ``await waterMark(base64string, watermarkbase64string, options);``
  
## Options

- {number} options.ratio
- {number} options.opacity
- {object} options.text (optional)
    - {string} options.text.message - message
    - {number} options.text.size - size of message 1 - 6
    - {string} options.text.position - position that include top-left, top-right , bottom-left and bottom-right - default is bottom-right