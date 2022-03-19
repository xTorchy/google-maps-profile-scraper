var request = require('request');
var cheerio = require('cheerio');
const db = require('titandb');
var midb = new db.crearDB("data", 'GoogleMaps');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


process.on('unhandledRejection', error => {
  console.error(error);
});


async function main() {
  var h = ['|', '/', '-', '\\'];
  var i = 0;
  let PROFILE_URL = readline.question(`Provide a Google Profile Link. Press "h" for help `, PROFILE_URL => {
    if(PROFILE_URL == "h") {
      console.clear()
      console.log(`Help Command:\n\n> GitHub Repository: https://github.com/xTorchy/google-maps-profile-scraper\n\n\n\n`)
        readline.close()
    } else {
    console.log(`Scraping ${PROFILE_URL}`)
    readline.close()
    try {
      getDealInfo(PROFILE_URL)
    } catch (e) {
      console.log(e)
    }}
  })

}


async function getDealInfo(url) {
  var options = {
    url: encodeURI(url),
    headers: {
      'Accept': '*/*',
      'Cache-Control': 'no-cache',
    }
  };
  request(options, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var title1 = $('meta[property="og:title"]').attr('content');
      var type1 = $('meta[property="og:description"]').attr('content');

      if (!title1 || !type1) return console.log('[\x1b[33mWARN\x1b[0m] The profile is hidden or there are no reviews made.')

      if (title1.includes('Contributions')) {
        if (type1.includes('Local Guide')) {
          LocalGuides2(title1, type1, url)
        } else {
          unLocalGuides2(title1, type1, url)
        }
      } else {
        if (type1.includes('Local Guide')) {
          LocalGuides(title1, type1, url)
        } else {
          unLocalGuides(title1, type1, url)
        }
      }







    } else {
      console.log('[\x1b[31mERROR\x1b[37m] Invalid link has provided')
    }
  });
}

async function LocalGuides(title1, type1, profile_link) {
  var local_guides_nvl = type1.split('Local Guide de nivel ')[1].split(' | ')[0].replace('n', 'N')
  var local_guides_score = type1.split(' | ')[1].split(' puntos')[0]
  var google_account_name = title1.split('Contribuciones de ')[1]

  midb.establecer(google_account_name, {
    Google_Account_Name: google_account_name,
    Local_Guides: "True",
    Level: local_guides_nvl,
    Score: local_guides_score,
    Link: profile_link
  }).then(console.log(google_account_name, {
    Google_Account_Name: google_account_name,
    Local_Guides: "True",
    Level: local_guides_nvl,
    Score: local_guides_score,
    Link: profile_link
  }))

  console.log('[\x1b[32mDONE\x1b[0m] SUCCESS SCRAPED THE PROFILE. ALL DATA HAS BEEN SAVED IN THE PATH: titan_databases > GoogleMaps > data.json')



}

async function unLocalGuides(title1, type1, profile_link) {
  var google_account_name = title1.split('Contribuciones de ')[1]
  var google_account_contribs = type1.split(' contribuciones')[0]

  midb.establecer(google_account_name, {
    Google_Account_Name: google_account_name,
    Local_Guides: "False",
    contributions: google_account_contribs,
    Level: null,
    Score: null,
    Link: profile_link
  }).then(console.log(google_account_name, {
    Google_Account_Name: google_account_name,
    Local_Guides: "False",
    contributions: google_account_contribs,
    Level: null,
    Score: null,
    Link: profile_link
  }))
  console.log('[\x1b[32mDONE\x1b[0m] SUCCESS SCRAPED THE PROFILE. ALL DATA HAS BEEN SAVED IN THE PATH: titan_databases > GoogleMaps > data.json')

}



async function LocalGuides2(title1, type1, profile_link) {
  var local_guides_nvl = type1.split(' | ')[0].split(' Local Guide')[0].replace('Level ', '')
  var local_guides_score = type1.split(' | ')[1].split(' Points')[0]
  var google_account_name = title1.split('Contributions by ')[1]

  midb.establecer(google_account_name, {
    Google_Account_Name: google_account_name,
    Local_Guides: "True",
    Level: local_guides_nvl,
    Score: local_guides_score,
    Link: profile_link
  }).then(console.log(google_account_name, {
    Google_Account_Name: google_account_name,
    Local_Guides: "True",
    Level: local_guides_nvl,
    Score: local_guides_score,
    Link: profile_link
  }))


  console.log('[\x1b[32mDONE\x1b[0m] SUCCESS SCRAPED THE PROFILE. ALL DATA HAS BEEN SAVED IN THE PATH: titan_databases > GoogleMaps > data.json')

}

async function unLocalGuides2(title1, type1) {
  var google_account_name = title1.split('Contributions by ')[1]
  var google_account_contribs = type1.split(' Contributions')[0]

  midb.establecer(google_account_name, {
    Google_Account_Name: google_account_name,
    Local_Guides: "False",
    contributions: google_account_contribs,
    Level: null,
    Score: null,
    Link: profile_link
  }).then(console.log(google_account_name, {
    Google_Account_Name: google_account_name,
    Local_Guides: "False",
    contributions: google_account_contribs,
    Level: null,
    Score: null,
    Link: profile_link
  }))
  console.log('[\x1b[32mDONE\x1b[0m] SUCCESS SCRAPED THE PROFILE. ALL DATA HAS BEEN SAVED IN THE PATH: titan_databases > GoogleMaps > data.json')

}


main()