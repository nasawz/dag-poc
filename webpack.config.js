const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const { getThemeVariables } = require("antd/dist/theme");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const StandaloneSingleSpaPlugin = require("standalone-single-spa-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = 'development'; // Or 'development'

module.exports = (webpackConfigEnv, argv) => {
  const { WEBPACK_BUNDLE, WEBPACK_BUILD } = webpackConfigEnv;
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

  let config = merge(defaultConfig, devtool, {
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
    devServer: {
      historyApiFallback: true,
      // quiet:false,
      proxy: {
        '/api': {
          target: 'http://localhost:1337',
          pathRewrite: { '^/api': '' },
        },
      },
    },
  });
  if (WEBPACK_BUNDLE && WEBPACK_BUILD) {
    config.plugins.push(new HtmlWebpackPlugin());
    config.plugins.push(
      new StandaloneSingleSpaPlugin({
        // required
        appOrParcelName: "@nasawz/dag-poc",

        // optional - strongly encouraged for single-spa applications
        activeWhen: ["/"],

        // optional - useful for enabling cross-microfrontend imports
        // importMapUrl: new URL("https://my-cdn.com/importmap.json"),

        // optional - useful for adding an additional, local-only import map
        importMap: {
          imports: {
            react:
              "https://cdn.jsdelivr.net/npm/react@16.13.1/umd/react.production.min.js",
            "react-dom":
              "https://cdn.jsdelivr.net/npm/react-dom@16.13.1/umd/react-dom.production.min.js",
            "react-router-dom":
              "https://cdn.jsdelivr.net/npm/react-router-dom@5.2.0/umd/react-router-dom.min.js",
          },
        },

        // optional - defaults to false. This determines whether to mount
        // your microfrontend as an application or a parcel
        isParcel: false,

        // optional - you can disable the plugin by passing in this boolean
        disabled: false,

        // optional - the standalone plugin relies on optionalDependencies in the
        // package.json. If this doesn't work for you, pass in your HtmlWebpackPlugin
        // to ensure the correct one is being referenced
        HtmlWebpackPlugin,

        // optional - defaults to true - turns on or off import-map-overrides.
        importMapOverrides: true,

        // optional - defaults to null. This allows you to hide the import-map-overrides UI
        // unless a local storage key is set. See more info at https://github.com/joeldenning/import-map-overrides/blob/master/docs/ui.md#enabling-the-ui
        importMapOverridesLocalStorageKey: null,

        // optional - defaults to {}. The single-spa custom props passed to the application
        // Note that these props are stringified into the HTML file
        // customProps: {
        //   authToken: "sadf7889fds8u70df9s8fsd"
        // },

        // optional - defaults to turning urlRerouteOnly on
        // The options object passed into single-spa's start() function.
        // See https://single-spa.js.org/docs/api#start
        startOptions: {
          urlRerouteOnly: true,
        },
      })
    );
  }
  return config;
};
