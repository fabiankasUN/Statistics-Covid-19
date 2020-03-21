module.exports = {
    mode: "development",
    entry: "./src/js/app.js",//path relative to this file
    output: {
        filename: "./bundle.js"//path relative to this file
    },
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
  }