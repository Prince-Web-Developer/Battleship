import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: {
    app: "./src/index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff2|woff)$/i,
        type: "asset/resource",
      },
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
};
