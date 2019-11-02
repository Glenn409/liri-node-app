require("dotenv").config();
const inquire = require('inquirer')
const keys = require("./keys.js");
var Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

const operation = process.argv[2];
const search = process.argv[3];
// console.log(operation);

//determines what the users wants to do
switch(operation){
    case 'spotify-this-song':
        console.log(`Searching for song called: ${search}!`)
        searchSpotify(search);
        break;
    case 'concert-this':
        break;
    case 'movie-this':
        break;
    case 'do-what-it-says':
        break;
}

//searches song and returns result to user
function searchSpotify(search){
    const results = [];

    spotify.search({
        type:'track',
        query: search,
    },function(err,data){
        if(err){
            console.log(err);
        }
        const trackData = data.tracks.items;
        // console.log(trackData.length);

        for (var i = 0; i < trackData.length;i++){
            const obj = {
                artist: trackData[i].album.artists[0].name
            }
            if(arrayCheck(results,obj) === false){
                results.push(obj);
            }
        }
        // console.log(data.tracks.items[3].album 
        console.log(results);
    })
};

//prevents duplicates entering an array
function arrayCheck(array, appendingObj){
    let check = false;
    for(i = 0; i < array.length;i++){
        // console.log(`comparing with the index of ${i}`)
        // console.log(`comparing ${array[i].artist} and ${appendingObj.artist}`)
        if(array[i].artist === appendingObj.artist){
            check = true;
            break;
        }
    }
    // console.log('returning: ' +check);
    return check;
}