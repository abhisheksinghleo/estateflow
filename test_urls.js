const https = require('https');

function checkUrl(url) {
  https.get(url, (res) => {
    console.log(`${url}: ${res.statusCode}`);
    if (res.headers.location) {
        console.log(`Redirect to: ${res.headers.location}`);
    }
  }).on('error', (e) => {
    console.error(e);
  });
}

checkUrl('https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80');
checkUrl('https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80');
checkUrl('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80');
