require("dotenv").config();
const inquire = require('inquirer')
const keys = require("./keys.js");
var Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require('axios');
var moment = require('moment')

const operation = process.argv[2];
let search = process.argv;
//set it up so if a search had multiple words it would be turned into one string without using quotations
search.splice(0,3);
search = search.join(' ');

//starting function to start LIRI BOT - determines what the users wants to do
switch(operation){
    case 'spotify-this-song':
        liriControl(operation,search);
        break;
    case 'concert-this':
        liriControl(operation,search);
        break;
    case 'movie-this':
        liriControl(operation,search);
        break;
    case 'do-what-it-says': 
        break;
}
//makes sures user puts in a value
function checkSearch(search){
    if(search === undefined || search === ''){
        return true;
    } else return false;
}

// function runs searchSpotify and makes sures input is valid
function liriControl(operation,input){
    // console.log(operation,input);
    switch(operation){
        case 'spotify-this-song':
                if(checkSearch(input) === false){
                    searchSpotify(input);
                } else {
                    console.log("\nLIRI BOT Detected no Song input! LIRI BOT searching LIRI BOT's favorite Song Instead.")
                    console.log('\nSearching song! Be Prepared To DANCE!')
                    searchSpotify('Africa - 8-Bit Toto Emulation');
                }
                break;
        case 'movie-this':
            searchMovie(input);
            break;
        case 'concert-this':
            if(checkSearch(input) === false){
                searchConcert(input);
            } else {
                console.log("\nLIRI BOT Detected no input! LIRI BOT searching LIRI BOT's favorite artist.")
                console.log('\nLIRI BOT submitting favorite band.')
                searchConcert('marshmellow');
            }
            break;
    }
}

//searches the bands in town api 
function searchConcert(search){
    axios.get(`https://rest.bandsintown.com/artists/${search}/events?app_id=codingbootcamp`)
    .then(function(res){
        console.log(`\nSearching for a venue for ${search}!`);
        var date = res.data[0].datetime;
        date = moment(date).format('MM/DD/YYYY');
        console.log('\nVenue: '+ res.data[0].venue.name)
        console.log('Location: '+ (res.data[0].venue.city)+', '+ (res.data[0].venue.country));
        console.log('Date: ' + date);
        searchAgain();
    }).catch(function(err){
        console.log('LIRI BOT detected a ERROR!\n')
        inquire.prompt([
            {
                type:'input',
                name: 'newSearch',
                message:`LIRI BOT recieved no results for ${search}\nSeach another Band: `
            }
        ]).then(function(data){
           liriControl('concert-this',data.newSearch);
        })
    })
}

//searches song and returns result to user
function searchMovie(search){
    console.log(`\nSearching for the movie called: ${search}`);

    axios.get(`http://www.omdbapi.com/?t=${search}&apikey=${process.env.OMDB_APIKEY}`)
    .then(function(res){
        var movieData = res.data;
        console.log(`\n---Results---\nTitle: ${movieData.Title}\nYear: ${movieData.Year}\n` +
        `Ratings:\n - ${movieData.Ratings[0].Source}: ${movieData.Ratings[0].Value}\n - ${movieData.Ratings[1].Source}: ${movieData.Ratings[1].Value}` +
        `\nCountry: ${movieData.Country}\nLanguage: ${movieData.Language}\nPlot: ${movieData.Plot}\nActors: ${movieData.Actors}\n`);
        searchAgain();
    })
    .catch(function(err){
        console.log('LIRI BOT detected a ERROR!\n')
        console.log("LIRI BOT subbmitting LIRI BOT's favorilte movie.")
        searchMovie('WALL-E')
    })
}
//searches song and returns result to user
function searchSpotify(search){
    const results = [];
    console.log(`\nSearching for song called: ${search}!\n`)
    spotify.search({
        type:'track',
        query: search,
    },function(err,data){
        if(err){
            console.log(err);
        }
        const trackData = data.tracks.items;
        for (var i = 0; i < trackData.length;i++){
            const obj = {
                name: trackData[i].album.artists[0].name,
                preview: trackData[i].preview_url,
                album: trackData[i].album.name,
                song: trackData[i].name
            }
        if(arrayCheck(results,obj) === false){
                results.push(obj);
            }
        }
        // console.log('-'.repeat(40));
        // console.log(results);/
        // console.log('-'.repeat(40));
        chooseSpotifyResults(results);
    })
};
//uses inquirer for the the user to pick a result in an array
function chooseSpotifyResults(array){
    var choicesNames = [];
    for (var i = 0; i < array.length; i++){
        choicesNames.push(array[i].name);
    }
    if(array.length === 1){
        console.log('Only one result returned!')
        console.log(`\nSong Name: ${array[0].song}\nArtist Name: ${array[0].name}\nAlbum Name: ${array[0].album}\nPreview URL of song: ${array[0].preview}\n`);
        searchAgain();
    } else {
        inquire.prompt([
            {
                type: 'list',
                name: 'choice',
                message: "LIRI BOT found multiple results, Pick the Artist you were searching for!",
                choices: choicesNames
            }
        ]).then(function(data){
            console.log(`\nRetrieving song info with the Arist : ${data.choice}!`);
            for(var i = 0; i < array.length; i++){
                if(array[i].name === data.choice){
                    console.log(`\nSong Name: ${array[i].song}\nArtist Name: ${array[i].name}\nAlbum Name: ${array[i].album}\nPreview URL of song: ${array[i].preview}\n`);
                }
            }
            searchAgain();
        })
    }
}

//prevents duplicate items entering an array
function arrayCheck(array, appendingObj){
    // console.log('CURRENT OBJECT', appendingObj)
    let check = false;
    for(i = 0; i < array.length;i++){
        // console.log(`comparing with the index of ${i}`)
        // console.log(`comparing ${array[i].name} and ${appendingObj.name}`)
        if(array[i].name === appendingObj.name){
            check = true;
            break;
        }
    }
    // console.log('returning: ' +check)
    return check;
}

//offer to make another search
function searchAgain(){
    inquire.prompt([
        {
            type: 'confirm',
            name: 'decision',
            message:'Would you like to make another choice?'
        }
        ]).then(function(data){
            if(data.decision === true){
                inquire.prompt([
                    {
                        type:'list',
                        name:'operation',
                        message:'Which database would you like to search today?',
                        choices: ['spotify-this-song','movie-this','concert-this']
                    },
                    {
                        type: 'input',
                        name:'search',
                        message:'What would you like to search?'
                    }
                ]).then(function(data){
                    liriControl(data.operation,data.search);
                })

            } else if (data.decision === false){
                console.log('Alright! LIRI BOT logging off!');
            }
            
        })
}

//Checks dates from bandsintowns api to see if event already passed, only want to post future events
function didEventAlrdyOccur(event){
    var currentDate = moment();
    console.log('event time: ' + event)
    console.log('current time: ' + currentDate);
}