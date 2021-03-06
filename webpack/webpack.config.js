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
          {
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ["@babel/plugin-proposal-class-properties"]
              }
            }
          }
        ],
      },
  }