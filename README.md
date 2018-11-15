# instagram-saver

Robot that automatically save all images from instragram

## Installation and Running
> Requires Node v7.6 or above

1. Clone the repo
```
$ git clone https://github.com/junggeehoon/instagram-saver
```
2. Install dependencies
```
$ npm install
```
3. Change the download path by setting `IMAGE_DIRECTORY` with a relative path 
to your desired location
```javascript
const IMAGE_DIRECTORY = './img'
```
4. Make config.js inside the project folder like under:
```javascript
const config = {
  email: 'YOUR_INSTAGRAM_EMAIL',
  password: 'YOUR_INSTAGRAM_PASSWORD'
}

module.exports = config;
```
5. Run either using `node index.js`
