const fs = require('fs');
const axios = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var getRepoInfo = require('git-repo-info');

// as per https://github.com/water-fountains/proximap/pull/338#issuecomment-609027058
// run with 
//    ~/git/proximap $ npm run sync_datablue
//
//   to run it just for one of the three, do
//      ~/git/proximap $ npm run sync_datablue for=locations 

// API URL.
const apiUrlBeta = 'https://api.beta.water-fountains.org/';
const apiUrlStable = 'https://api.water-fountains.org/';
const apiUrlLocal = 'http://localhost:3000/'; // use in development.

const callAPI = function(branch, filename, url) {
  const apiUrl = (branch === 'stable') ? apiUrlStable : apiUrlBeta;

  const metadataUrl = `${apiUrl}api/v1/metadata/${url}`;

  // Get fountain_properties data from server and create file.
  axios.get(metadataUrl)
  .then(function (response) {
    // handle success
    const data = JSON.stringify(response.data, null, 4);
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, '', {encoding: 'utf8'});
    }
    fs.writeFileSync(filename, data, {encoding: 'utf8'});
    console.log(`${metadataUrl} sync ${branch} DONE to `+filename+' '+new Date().toISOString());
  })
  .catch(function (error) {
    // handle error
    console.log(error+' '+new Date().toISOString());
  });
}

const workOnRelevantArgs = function(args) {
   for (let arg of args) {
        switch(arg.trim().toLowerCase()) {
          case 'fountains':
            createSharedFile(`./src/assets/fountain_properties.json`, 'fountain_properties')
              .then(
                resp => {
                }
              )
              .catch(
                error => {
                  console.error(error);
                }
              );
            break;
          case 'locations':
            createSharedFile(`./src/assets/locations.json`, 'locations')
              .then(
                resp => {
                }
              )
              .catch(
                error => {
                  console.error(error);
                }
              );
            break;
          case 'constants':
            createSharedFile(`./src/assets/shared-constants.json`, 'shared-constants')
              .then(
                resp => {
                }
              )
              .catch(
                error => {
                  console.error(error);
                }
              );
            break;
          default:
            console.log('for= "'+arg+'" unknown - so doing all 3 "fountains,locations,constants" '+new Date().toISOString());
            createSharedFile(`./src/assets/fountain_properties.json`, 'fountain_properties')
              .then(
                resp => {
                }
              )
              .catch(
                error => {
                  console.error(error);
                }
              );
            createSharedFile(`./src/assets/locations.json`, 'locations')
              .then(
                resp => {
                }
              )
              .catch(
                error => {
                  console.error(error);
                }
              );
            createSharedFile(`./src/assets/shared-constants.json`, 'shared-constants')
              .then(
                resp => {
                }
              )
              .catch(
                error => {
                  console.error(error);
                }
              );
            }
          }
} 


if (process.argv.length > 2) {
  let i = -1;
  process.argv.forEach(function (val, index, array) {
    i++;
    if (val.indexOf('for') !== -1) {
      const argsWoEqual = val.split('=');
      if (2 != argsWoEqual.length) {
         console.log('val "'+val+'" should be followed by a "=" and then "fountains|locations|constants" (if multiple separated by comma) '+new Date().toISOString());
      } else {
        const args = argsWoEqual[1].split(',');
        workOnRelevantArgs(args);
      }
    }else {
       if (1 < i) {
         const valTrLc = val.trim().toLowerCase();
         if (2 == i && 8 < valTrLc.length) {
            const args = [valTrLc];
	        workOnRelevantArgs(args);
	        if (process.argv.length > 3) {
               console.log('ignoring further arguments " '+new Date().toISOString());
	        }
	        return;
         } else {
           console.log(i+': unknown argument "'+val+'" - either none or "fountains|locations|constants" (if multiple separated by comma)" '+new Date().toISOString());
         }
       }
    }
  })
} else {
  createSharedFile(`./src/assets/fountain_properties.json`, 'fountain_properties')
        .then(
          resp => {

          }
        )
        .catch(
          error => {
            console.error(error);
          }
        );
      createSharedFile(`./src/assets/locations.json`, 'locations')
        .then(
          resp => {

          }
        )
        .catch(
          error => {
            console.error(error);
          }
        );
      createSharedFile(`./src/assets/shared-constants.json`, 'shared-constants')
        .then(
          resp => {

          }
        )
        .catch(
          error => {
            console.error(error);
          }
        );
}


async function createSharedFile(filename, url) {
  //console.log(`starting "${url}" to "`+filename+'" '+new Date().toISOString());
  const branch = (await exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
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