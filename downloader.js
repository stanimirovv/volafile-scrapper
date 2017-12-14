const getStdin = require('get-stdin');
const https = require("https");
const fs = require('fs');
const url = require("url");
const path = require("path");
 
// USAGE: node downloader.js <dir to save files in>

getStdin().then(str => {
   // Get download dir
   downloadDir = process.argv.slice(2).toString();
   if( !downloadDir ) {
      console.log( 'You must pass a command line argument for the download directory.' );
      return;
   }

   urls = getURLsFromHTML( str );
   // Volafile the links in the room lead to a page with HTML,
   // not to the picture. we need to resolve them to the paths to the picture
   resolvedURLs = resolveURLs( urls );
   // ensure you don't download files which are already present
   urlsToDownload = filterDownloadedFiles( resolvedURLs, downloadDir ); 
   // download new files
   downloadFiles( urlsToDownload, downloadDir );
   console.log( 'Done.' );
});

function getURLsFromHTML( html ) {
   const cheerio = require('cheerio');
   const $ = cheerio.load( html );

   urls = [];
   $('.file_left_part').each( function(idx) {
         urls.push ( $( this ) .attr("href") );
   });

   return urls;
}

function resolveURLs ( urls ) {
   var resolvedURLs = [];
   for ( i = 0; i < urls.length; i++ ) {
      var parsed;
      try {
         parsed = url.parse( urls[i]);
      } catch ( e ) {
         console.log( 'Could not resolve URL: ' + urls[i] );
         continue;
      }

      volafilePictureURL = 'https://dl5.volafile.net';
      var resolvedURL = volafilePictureURL + parsed.pathname;
      resolvedURLs.push( resolvedURL );
   }
   return resolvedURLs;
}

function filterDownloadedFiles( urls, downloadDir ) {
   var urlsToDownload = new Array;
   var filesInDownloadDir = fetchFilesFromDownloadDir( downloadDir );

   for ( i = 0; i < urls.length; i++ ) {
      var fileName = '';
      try {
         fileName = extractFileNameFromURL( urls[i] );
      } catch( e ) {
         console.log ( 'Could not extract file name from URL: ' + urls[i] + ' ' + e.message );
         return;
      }

      if ( !filesInDownloadDir[ fileName ] ) {
         urlsToDownload.push( urls[i] );
      }
   }

   return urlsToDownload;
}

function fetchFilesFromDownloadDir( downloadDir ) {
   var filesInDownloadDir = [];
   fs.readdirSync( downloadDir ).forEach(file => {
      filesInDownloadDir[ file ] = 1;
   })

   return filesInDownloadDir;
}

function downloadFiles( fileURLs, downloadDir) {
   for ( i = 0; i < fileURLs.length; i++ ) {
      downloadFile( fileURLs[i], downloadDir );
   }
}

function downloadFile ( fileURL, downloadDir ) {
https.get( fileURL, (res) => {
      // Handle network errors
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
         error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
      }

      // Save file to Disk
      saveFileToDisk( fileURL, downloadDir , res );  
   }).on('error', (e) => {
      console.error( ' Failed downloading: ' + fileURL + ' error message: ' + e.message);
   });

}

function saveFileToDisk ( fileURL, downloadDir, res ) {
   // get file name
   var fileName = '';
   try {
      fileName = extractFileNameFromURL( fileURL );
   } catch( e ) {
      console.log ( 'Could not extract file name from URL: ' + fileURL + ' ' + e.message );
      return;
   }

   // ensure dir exists
   if ( !fs.existsSync( downloadDir ) ) {
      console.log( "Directory does not exist: " + downloadDir );
      return;
   }

   // save to disk
   try {
      var filePath =  downloadDir + '/' + fileName 
      var file = fs.createWriteStream( filePath );
      res.pipe(file);
   } catch ( e ) {
      console.log ( 'Could not save to disk file: ' + fileName + ' URL: ' + fileURL + ' ' + e.message );
      return;
   }
   console.log( 'Downloaded succesfully ' + fileURL + ' to file: ' + fileName );
   return 1;
}

function extractFileNameFromURL ( fileURL ) {
   var parsed = url.parse( fileURL );
   filePath = parsed.pathname;
   return path.basename( filePath );
}

