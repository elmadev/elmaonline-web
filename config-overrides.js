const {
  override,
  addWebpackAlias,
} = require("customize-cra");
const path = require("path");

module.exports = override(
  // add an alias for "ag-grid-react" imports
  addWebpackAlias({
    components: path.resolve(__dirname, "src/components"),
    images: path.resolve(__dirname, "src/images"),
    pages: path.resolve(__dirname, "src/pages"),
    styles: path.resolve(__dirname, "src/styles"),
    utils: path.resolve(__dirname, "src/utils"),
    constants: path.resolve(__dirname, "src/constants"),
    api: path.resolve(__dirname, "src/api"),
    globalStyle: path.resolve(__dirname, "src/globalStyle"),
    muiTheme: path.resolve(__dirname, "src/muiTheme")
  }),
);
