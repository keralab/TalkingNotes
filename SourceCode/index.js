'use strict';
process.env.DEBUG = 'actions-on-google:*';
const functions = require('firebase-functions'); // Cloud Functions for Firebase library
//FUTURE DATABASE SETUP
// var firebase = require("firebase");
// // Set the configuration for your app
//   // TODO: Replace with your project's config object
//   var config = {
//     apiKey: "AIzaSyDDmuCbkXahUzVrDd3aXS96_sQ-wjirVhg",
//     authDomain: "musicteacher-d615b.firebaseapp.com",
//     databaseURL: "https://musicteacher-d615b.firebaseio.com/",
//     storageBucket: "musicappsounds.appspot.com"
//   };
//   firebase.initializeApp(config);
//var database = firebase.database();
const App = require('actions-on-google').DialogflowApp;
const INSTRUMENT_ACTION = 'Instrument';
const INSTRUMENT_ARGUMENT = 'Instruments';
const ENTER_ARGUMENT ='Stages';
const COMPLETE_ACTION = 'step.complete';
const LEVEL_SECTION_ACTION = 'levelsection';
const LEVEL_SECTION_ARGUMENT ='LevelSections';
const LEVEL_CONFIRMATION = 'getlevelname';
const CONFIRM = 'YesNo';
const PLAY_BEFORE_CONFIRM = 'CONFIRMATION';
const SECTION_RATING = 'ratesession';
const RATING_ARGUMENT = 'number';
const WELCOME_ACTION = 'input.welcomefirst'
//var Ssml = require('ssml');
//var ssmlDoc = new Ssml();
var instrument;
var level;


//var jsonData = JSON.stringify(data);

exports.musicTeacher = functions.https.onRequest((request, response) => {
const app = new App({request, response});
console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  function welcomeIntent (app) {
    var last = app.getUser().lastSeen;
    var stringmsg = "";
    if(last!="" || last !=null){
      last = last.split("T")[0];
      stringmsg = ' Welcome, the last time you practiced was '+last+'. What instrument do you want to work on?';
   }else{
     stringmsg = 'Welcome, let\'s start practicing. What instrument do you want to work on?';
   }
    //var last = "";
    app.ask(stringmsg);
  }

  function choseInstrument (app) {
          instrument = app.getArgument(INSTRUMENT_ARGUMENT);
          app.ask('Okay, I\'d like to know more about your skill with ' + instrument + '. Would you call yourself a Beginner, Intermediate or Expert?');
      }

    function getLevelSection(app){
      let section = app.getArgument(LEVEL_SECTION_ARGUMENT);
      if(section == 'Beginner'){
        app.ask('And have you ever played the ' + instrument + ' before?');
      }else{
        app.tell('Apologies, we haven\'t yet developed this content. Check back soon!');
      }
    }

    function getHavePlayedConfirmation(app){
        let hasplayed = app.getArgument(CONFIRM);
        if(hasplayed == 'Yes'){
          if(instrument == 'cello' || instrument == 'clarinet' || instrument == 'violin'){
            level = 2;
            tuning(app, 2);
          }else if(instrument == 'piano' || instrument == 'recorder'){
            level =2;
            scales(app, 2);
          }
        }else{
          if(instrument == 'cello' || instrument == 'clarinet' || instrument == 'violin'){
            level = 1;
            teach(app, 1);
          }else if(instrument == 'piano' || instrument == 'recorder'){
            level = 1;
            teach(app, 1);
          }
        }
    }

   function teach(app, level){
     let text_to_speech = '<speak>'
     + 'I\'d like you to start by having a look at this video. It will show you the basics of playing the '
     + instrument
     + ". When you\'re done, let me know by saying Ok Google, tell Talking Notes I\'m finished training. "
     +'</speak>';
     if (instrument == 'violin'){
       app.tell(app.buildRichResponse().addSimpleResponse(text_to_speech).addBasicCard(app.buildBasicCard('This is a violin teaching video.').setTitle('Teach Violin').addButton('Read more', 'https://www.youtube.com/watch?v=88G0O5unNuQ')));
     }else if (instrument == 'piano') {
       app.tell(app.buildRichResponse().addSimpleResponse(text_to_speech).addBasicCard(app.buildBasicCard('This is a piano teaching video.').setTitle('Teach Piano').addButton('Read more', 'https://www.youtube.com/watch?v=vphWgqbF-AM')));
     }else{
       app.tell('Apologies, level 1 of ' + instrument + ' is not yet supported by Talking Notes. Please check back soon!');
     }
   }

   function tuning(app, level){

       if (instrument == 'cello' || instrument == 'violin'){
          let text_to_speech = '<speak>'
              +'Alright, it looks like we\'ll mark your level as '
              + level
              + '. Let\'s start by tuning. When you\'re finished, let me know by voice activating and telling Talking Notes I\'m finished tuning. Here\'s an A note.'
              +'<audio  src = "https://storage.googleapis.com/musicappsounds/A440.ogg"></audio>'
              + '</speak>';
              app.tell(text_to_speech);
         } else if (instrument =='clarinet') {
           let text_to_speech = '<speak>'
               +'Alright, your level is '
               + level
               + '. Let\'s start by tuning. When you\'re finished, let me know by voice activating and telling Talking Notes I\'m finished tuning. Here\'s a B flat note.'
               +'<audio  src = "https://storage.googleapis.com/musicappsounds/Tuning-Note-For-Clarinett.ogg"></audio>'
               + '</speak>';
               app.tell(text_to_speech);
         } else {
             let text_to_speech = '<speak>'
              + 'For default tuning, we\'ll use a B flat note. When you\'re finished, let me know by voice activating and telling Talking Notes I\'m finished tuning.'
              +'<audio  src = "https://storage.googleapis.com/musicappsounds/Tuning-Note-For-Clarinett.ogg"></audio>'
              + '</speak>';
              app.tell(text_to_speech);
         }
     }

     function scales(app,level){

       let text_to_speech = '<speak>'
       + 'Let\'s try some scales. I\'ll turn on the metronome and show you the sheet music so you can play a C Major and E minor scale. When you\'re finished, let me know by voice activating and telling Talking Notes I\'m finished with scales. If you\'re having any trouble, check out the link I\'ve included. '
       + '<audio src = "https://storage.googleapis.com/musicappsounds/50BPM-Metronome-Beat-MP3-Metronome.ogg"></audio>'
       + '</speak>';
       app.tell(app.buildRichResponse().addSimpleResponse(text_to_speech).addBasicCard(app.buildBasicCard('this is sheet music').setTitle('sheet music').addButton('Read more', 'https://www.youtube.com/watch?v=PpxAg5T-4EQ').setImage('https://storage.googleapis.com/musicappsounds/c%20major%20and%20e-minor-scale-on-bass-clef.PNG','Image alternate text').setImageDisplay('DEFAULT')));
     }

     function repertoire(app){

       let text_to_speech = '<speak>'
       + 'For '
       + instrument
       + ', let\'s move on to repertoire. I\'ll turn on the metronome and you can play Twinkle Twinkle Little Star. When you\'re finished, let me know by voice activating and telling Talking Notes I\'m finished with repertoire. '
       + '<audio src = "https://storage.googleapis.com/musicappsounds/50BPM-Metronome-Beat-MP3-Metronome.ogg"></audio>'
       + '</speak>';
       app.tell(app.buildRichResponse().addSimpleResponse(text_to_speech).addBasicCard(app.buildBasicCard('this is sheet music').setTitle('sheet music').setImage('https://storage.googleapis.com/musicappsounds/26995322_1915725461788630_811074330_n.jpg','Image alternate text').setImageDisplay('DEFAULT')));
     }

      function completeStep (app) {

          let stage = app.getArgument(ENTER_ARGUMENT);
          if (stage == 'training'){
            if (instrument == 'cello' || instrument == 'clarinet' || instrument == 'violin'){
              tuning(app,1);
            } else {
              scales(app,1);
            }
          } else if(stage == 'tuning'){
              scales(app);            //tuning(app);
          } else if(stage == 'scales'){
              repertoire(app);
          } else if(stage == 'repertoire'){
                rateSession(app);
            }
      }

    function rateSession(app) {
      app.ask('That\'s it for today\'s session! Can you take a moment to let me know how difficult you found it on a scale of 1 to 5?');
    }

    function numberRating(app){
      let rating = app.getArgument(RATING_ARGUMENT);
      //WRITE TO DATABASE
      // firebase.database().ref('user').set({
      //   id : app.getUser().userId,
      //   inst : instrument,
      //   lvl :level
      // });


      if (rating == '5'){
        app.tell('I\'m sorry to hear you had a hard time. I\'ll make sure your next session is a bit more your speed.');
      }
      if (rating == '4'){
        app.tell('Sometimes a challenge is a good thing! We can work on improving together.');
      }
      if (rating == '3'){
        app.tell('I\'m glad I could challenge you today! Let\'s keep working on this tomorrow!');
      }
      if (rating == '2'){
        app.tell('Happy to hear you\'re enjoying this material! Come back to practice soon!');
      }
      if (rating == '1'){
        app.tell('Wow, I\'m impressed! Maybe it\'s time to move to the next level! We should consider this for next time.');
      }


    }
  // d. build an action map, which maps intent names to functions
  let actionMap = new Map();
  actionMap.set(INSTRUMENT_ACTION, choseInstrument);
  actionMap.set(COMPLETE_ACTION,completeStep);
  actionMap.set(LEVEL_SECTION_ACTION, getLevelSection);
  actionMap.set(PLAY_BEFORE_CONFIRM, getHavePlayedConfirmation);
  actionMap.set(SECTION_RATING, numberRating);
  actionMap.set(WELCOME_ACTION, welcomeIntent);
app.handleRequest(actionMap);
});
