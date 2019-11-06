LIRI BOT

- LIRI BOT is a basic node application that makes api calls to spotify, OMDB, or Bandsintown and returns results based on your search.

- LIRI BOT uses
    - node.js
    - javascript
    - [Axios](https://www.npmjs.com/package/axios/?target=_blank)
    - [moment.js](https://momentjs.com//?target=_blank)
    - [file-system](https://www.npmjs.com/package/file-system/?target=_blank)
    - [DotEnv](https://www.npmjs.com/package/dotenv/?target=_blank)

- API's used
    - Node-Spotify-APi
    - OMDB
    - Bands In Town

-In order to run LIRI BOT on your own pc. you need to follow a few simple steps.

    1. Git Clone the the repository to your own computer.

    2.In a terminal run npm install.

    3. Sign up for a Spotify key at https://developer.spotify.com/dashboard/.

    4. Sign up for a OMDB key at http://www.omdbapi.com.

    5. After retrieving keys you will create a .env file in the main directory

    6. you will set up 3 variables in the .env file
        -SPOTIFY_ID=(your spotify id)
        -SPOTIFY_SECRET=(your spotify secret)
        -OMDB_APIKEY=(your omdb apikey)

    7.After you set up your .env file you should be ready to go.

    8.You have 4 different operations you can run.
        1. spotify-this-song
        2. concert-this
        3. movie-this
        4. do-what-it-says

    9.Open up your terminal and in the directory run 
        - node liri.js (a operation) (input)

[Link to LIRI BOT demontration](https://drive.google.com/file/d/1GY2B_VnypOGbIEP6aD7YFPvDDFBzAmP0/view/?target=_blank)