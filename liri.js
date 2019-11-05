require("dotenv").config();
const inquire = require('inquirer')
const keys = require("./keys.js");
var Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require('axios');

const operation = process.argv[2];
const search = process.argv[3];


//starting function to start LIRI BOT - determines what the users wants to do
switch(operation){
    case 'spotify-this-song':
        liriControl(operation,search);
        break;
    case 'concert-this':
        break;
    case 'movie-this':
        liriControl(operation,search);
        break;
    case 'do-what-it-says': 
        break;
}
//makes sures user puts in a value
function checkSearch(search){
    if(search === undefined){
        return true;
    } else return false;
}

// function runs searchSpotify and makes sures input is valid
function liriControl(operation,input){
    // console.log(operation,input);
    switch(operation){
        case 'spotify-this-song':
                if(checkSearch(input) === false){
                    console.log(`\nSearching for song called: ${input}!\n`)
                    searchSpotify(input);
                } else {
                    console.log('\nLIRI BOT Detected no Song input!! LIRI BOT searching my favorite Song Instead')
                    console.log('\nSearching: "Highest in the room" by Travis Scott\nPlease Select - Travis Scott <3\n')
                    searchSpotify('Highest in the Room');
                }
                break;
        case 'movie-this':
            searchMovie(input);
            break;
    }
}
//searches song and returns result to user
function searchMovie(search){
    axios.get(`http://www.omdbapi.com/?t=${search}&apikey=${process.env.OMDB_APIKEY}`)
    .then(function(res){
        console.log(res.data);
    })
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
        
        for (var i = 0; i < trackData.length;i++){
            const obj = {
                name: trackData[i].album.artists[0].name,
                preview: trackData[i].album.artists[0].external_urls.spotify,
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
                message: "We found multiple results, Pick a result!",
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
                        choices: ['spotify-this-song']
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