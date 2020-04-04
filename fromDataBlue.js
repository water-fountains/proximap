const fs = require('fs');
const axios = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var getRepoInfo = require('git-repo-info');

// API URL.
const apiUrlBeta = 'https://api.beta.water-fountains.org/';
const apiUrlStable = 'https://api.water-fountains.org/';
const apiUrlLocal = 'http://localhost:3000/'; // use in development.

if (process.argv.length > 2) {
  process.argv.forEach(function (val, index, array) {
    if (val.indexOf('for') !== -1) {
      const args = val.split('=')[1].split(',')
      for (let arg of args) {
        switch(arg) {
          case 'fountains':
            createSharedFile(`./src/assets/fountain_properties.json`, 'fountain_properties');
            break;
          case 'locations':
            createSharedFile(`./src/assets/locations.json`, 'locations');
            break;
          case 'constants':
            createSharedFile(`./src/assets/shared-constants.json`, 'shared-constants');
            break;
          default:
            createSharedFile(`./src/assets/fountain_properties.json`, 'fountain_properties');
            createSharedFile(`./src/assets/locations.json`, 'locations');
            createSharedFile(`./src/assets/shared-constants.json`, 'shared-constants');
        }
      }
    }
  })
} else {
  createSharedFile(`./src/assets/fountain_properties.json`, 'fountain_properties');
  createSharedFile(`./src/assets/locations.json`, 'locations');
  createSharedFile(`./src/assets/shared-constants.json`, 'shared-constants');
}


async function createSharedFile(filename, url) {
  const branch = process.env.TRAVIS_BRANCH ||
               (await exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
                 if (err) {
                  var info = getRepoInfo();
                  callAPI(info.branch, filename, url)
                 } else if (stdout) {
                  const branch =  stdout.toString().trim()
                  callAPI(branch, filename, url)
                 }
               }));
  callAPI(branch, filename, url)
}

const callAPI = function(branch, filename, url) {
  const apiUrl = (branch === 'stable') ? apiUrlStable : apiUrlLocal;

  let metadataUrl = `${apiUrl}api/v1/metadata/${url}`;

  // Get fountain_properties data from server and create file.
  axios.get(metadataUrl)
  .then(function (response) {
    // handle success
    const data = JSON.stringify(response.data, null, 4);
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, '', {encoding: 'utf8'});
    }
    fs.writeFileSync(filename, data, {encoding: 'utf8'});
    console.log(`${url} sync ${branch} DONE to `+filename+' '+new Date().toISOString());
  })
  .catch(function (error) {
    // handle error
    console.log(error+' '+new Date().toISOString());
  });
}
