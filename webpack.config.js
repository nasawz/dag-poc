const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const { getThemeVariables } = require("antd/dist/theme");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

process.env.NODE_ENV = 'development'; // Or 'development'

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "nasawz",
    projectName: "dag-poc",
    webpackConfigEnv,
    argv,
  });
  const { mode } = argv;
  let devtool = {};
  if (mode == "production") {
    devtool = {
      devtool: false,
    };
  }

  return merge(defaultConfig, devtool, {
    externals: [],
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader", // translates CSS into CommonJS
            },
            {
              loader: "less-loader", // compiles Less to CSS
              options: {
                lessOptions: {
                  modifyVars: Object.assign(
                    getThemeVariables({
                      // dark: true, // 开启暗黑模式
                      compact: false, // 开启紧凑模式
                    }),
                    {
                      // "primary-color": "#0186FD",
                      // "font-size-base": "16px",
                      // "font-size-sm":"12px",
                      // "layout-header-height": 50,
                    }
                  ),
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      // new CopyPlugin({
      //   patterns: [
      //     { from: "public", to: "./" }
      //   ],
      // }),
    ],
  });
};
