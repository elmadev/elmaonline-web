const {
  override,
  addWebpackAlias,
} = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    components: path.resolve(__dirname, "src/components"),
    images: path.resolve(__dirname, "src/images"),
    pages: path.resolve(__dirname, "src/pages"),
    utils: path.resolve(__dirname, "src/utils"),
    constants: path.resolve(__dirname, "src/constants"),
    api: path.resolve(__dirname, "src/api"),
    globalStyle: path.resolve(__dirname, "src/globalStyle"),
    muiTheme: path.resolve(__dirname, "src/muiTheme"),
    config: path.resolve(__dirname, "src/config"),
    features: path.resolve(__dirname, "src/features")
  }),
);
