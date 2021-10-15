const prod = process.env.NODE_ENV === "production";
const github = process.env.NODE_ENV === "github";
//
// pwa config
// https://cli.vuejs.org/core-plugins/pwa.html#configuration
module.exports = {  
  publicPath : github? '/CMS': (prod? '/':'/'),
  // devServer: {
  //   proxy: {
  //     '^/artist': {
  //       target: 'http://localhost:4000',
  //       changeOrigin: true, // so CORS doesn't bite us. 
  //     }
  //   }
  // },
  pwa:{
    name:"mppng2051",
    themeColor:"#000000",
    appleMobileWebAppCapable: false,
    appleMobileWebAppStatusBarStyle:'#000000',
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      // swSrc: 'dev/sw.js',
      // ...other Workbox options...
      exclude: [".htaccess"]
    }

  }
}