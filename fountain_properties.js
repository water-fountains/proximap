// Create or update fountain_properties JSON file ('src/assets/fountain_properties.json').
// Command: 'npm run fountain_properties'

const fs = require('fs');
const axios = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var getRepoInfo = require('git-repo-info');

// API URL.
const apiUrlBeta = 'https://api.beta.water-fountains.org/';
const apiUrlStable = 'https://api.water-fountains.org/';
const apiUrlLocal = 'http://localhost:3000/'; // use in development.

// create fountain_properties.JSON
async function createFountainProperties(filename) {

// use travis branch environment variable if available, because in Travis the git branch is called HEAD by default
const branch = process.env.TRAVIS_BRANCH ||
               (await exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
                 if (err) {
                  var info = getRepoInfo();
                  callAPI(info.branch, filename)
                 } else if (stdout) {
                  const branch =  stdout.toString().trim()
                  callAPI(branch, filename)
                 }
               }));
  callAPI(branch, filename)
}

const callAPI = function(branch, filename) {
  const apiUrl = (branch === 'stable') ? apiUrlStable : apiUrlBeta;

  let metadataUrl = `${apiUrl}api/v1/metadata/fountain_properties`;

  // Get fountain_properties data from server and create file.
  axios.get(metadataUrl)
  .then(function (response) {
    // handle success
    const locations = JSON.stringify(response.data, null, 4);
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, '', {encoding: 'utf8'});
    }
    fs.writeFileSync(filename, locations, {encoding: 'utf8'});
    console.log('Fountain properties sync DONE.')
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
}

// File save path.
createFountainProperties('./assets/fountain_properties.json');
