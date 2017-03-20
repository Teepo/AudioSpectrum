# AudioSpectrum

## Getting started

```js
npm install
npm run start
```

Run your favorite browser and go to http://localhost:3000

## Example

```js
var player = new Player();

// You can upload an audio file
player.listen(
  document.querySelector('input[type="file"]')
);

// OR read an external file.
player.loadByUrl("http://www.mfiles.co.uk/mp3-downloads/mozart-symphony40-1.mp3");
```

![alt tag](https://cloud.githubusercontent.com/assets/332863/13904998/7844693c-eeb3-11e5-8bae-9782753f4e6e.png)
