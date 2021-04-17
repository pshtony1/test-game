import App from "./App.js";

window.onload = () => {
  // let f = new FontFace(
  //   "Comic Sans Custom",
  //   'url("./src/fonts/Comic-Sans/COMIC.TTF")'
  // );

  new App(document.getElementById("App"));

  // f.load()
  //   .then((font) => {
  //     document.fonts.add(font);
  //   })
  //   .catch((e) => {
  //     console.error(e);
  //   });
};
