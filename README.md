# stylelint-codeframe-formatter

[![npm version](https://badge.fury.io/js/stylelint-codeframe-formatter.svg)](http://badge.fury.io/js/stylelint-codeframe-formatter)
[![dependencies Status](https://david-dm.org/bencergazda/stylelint-codeframe-formatter/status.svg)](https://david-dm.org/bencergazda/stylelint-codeframe-formatter)
[![devDependencies Status](https://david-dm.org/bencergazda/stylelint-codeframe-formatter/dev-status.svg)](https://david-dm.org/bencergazda/stylelint-codeframe-formatter?type=dev)

[Stylelint](https://stylelint.io/) formatter using [babel-code-frame](https://www.npmjs.com/package/babel-code-frame) to show the piece of code where the errors and warnings are.

![](screenshot.png)

## Install

```console
npm install stylelint-codeframe-formatter --save-dev
```

## Usage

### Stylelint CLI

```console
stylelint --custom-formatter path/to/stylelint-codeframe-formatter file.css
```

### [stylelint-webpack-plugin](https://github.com/JaKXz/stylelint-webpack-plugin/)

`webpack.config.js`

```js
module.exports = {
    plugins: [
        new StylelintPlugin({
            formatter: require('stylelint-codeframe-formatter'),
            ...
        })
    ],
    ...
};
```

### [grunt-stylelint](https://github.com/wikimedia/grunt-stylelint/)

`Gruntfile.js`

```js
module.exports = function(grunt) {
    grunt.initConfig({
        stylelint: {
            scss: {
                options: {
                    formatter: require('stylelint-codeframe-formatter')
                },
                ...
            }
        },
        ...
    });
};
```

## License

MIT © [Benedek Káldi](http://bencergazda.hu)

Heavily based on [Adrien Antoine](https://adriantoine.com)'s [eslint-codeframe-formatter](https://github.com/adriantoine/eslint-codeframe-formatter)
