// Create or update location JSON file ('src/assets/locations.json').
// Command: 'npm run location'

const writeFileSync = require('fs').writeFileSync;
const axios = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// API URL.
const apiUrlBeta = 'https://api.beta.water-fountains.org/';
const apiUrlStable = 'https://api.water-fountains.org/';
const apiUrlLocal = 'http://localhost:3000/'; // use in development.

// create location.JSON
async function createLocationFile(filename) {
  
// use travis branch environment variable if available, because in Travis the git branch is called HEAD by default
const branch = process.env.TRAVIS_BRANCH || (await exec('git rev-parse --abbrev-ref HEAD')).stdout.toString().trim();

const apiUrl = (branch === 'stable') ? apiUrlStable : apiUrlBeta;

let metadataUrl = `${apiUrl}api/v1/metadata/locations`;

// Get location data from server and create file.
axios.get(metadataUrl)
  .then(function (response) {
    // handle success
    const locations = JSON.stringify(response.data, null, 4);

    writeFileSync(filename, locations, {encoding: 'utf8'});
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });

}

// File save path. 
createLocationFile('src/assets/locations.json');
