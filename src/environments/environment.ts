// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // url_server: 'http://192.168.10.207:4522/api/',//4000
  // url_server_tupa: 'http://192.168.10.207:4520/api/',//208:4001
  // wsUrl: 'http://192.168.10.207:8081',//8081
  url_server: "http://18.212.167.46:4052/api/",
  url_server_tupa: "http://18.212.167.46:4053/api/", //207:4520
  wsUrl: "http://18.212.167.46:8081"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
