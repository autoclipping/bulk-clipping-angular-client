// this file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// the list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'https://knj39gne6j.execute-api.us-east-1.amazonaws.com/test',
    token: 'nZP9IvQ5iOIFZTg3KLgkogKhh23sy5CXJflSUYTH7nrr5d+Ksk8JUo9LIesKB0RNXYsUIEQM/pt7ARXDbOPXOngxNjc2OTUw',
    imageMaxSize: 2000000, 
    batchSize: 100,
    imageQuality: 0.95,
    uploadLimit: 100,
    // api load interval in seconds
    batchUpdateInterval: 2,
    mojoUpdateInterval: 5,
    // continuous update duration in seconds
    updateDuration: 1800
};
