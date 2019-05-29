/**
 * Copyright 2018, Google, LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var express = require('express')
// , routes = require('./routes')
// , user = require('./routes/user')
// , postProvider = require('./postProvider.js')
, http = require('http')
, path = require('path')
, compass = require('node-compass');

let cors = require('cors');
var app = express();

var bodyParser = require('body-parser');
const projectId = process.env.GCLOUD_PROJECT;
const { struct } = require('pb-util');
const sessionId = require('uuid/v1')();
const util = require('util');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "http://localhost:4200/");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// app.listen(8080, function(){
//   console.log("Server connected. Listening on port: " + (process.env.PORT || 8080));
// });

app.post('/ping', function (req, res) {
  console.log('mohan post');
 //return ds(req.body);
});
app.get('/test',  function(req, res, next) {
  console.log("Reloading");
  var myTestVar = "Hello World";
  return res.send(myTestVar);
  // res.sendFile('index.html', { root: __dirname }); 
});
async function ds(query){
 return detectIntentandSentiment("a","b",query,"en-us");
}

async function detectIntentandSentiment(
  projectId,
  sessionId,
  query,
  languageCode
) {
  // [START dialogflow_detect_intent_with_sentiment_analysis]
  // Imports the Dialogflow client library
  const dialogflow = require('dialogflow').v2beta1;

  // Instantiate a DialogFlow client.
  console.log('entered');
  //const dialogflow = require('dialogflow');
  sessionId = '011bb950-f801-11e8-a9f4-eff5965aae41';
  languageCode = "en-US";
  projectId = "testbot-8ab5a";
  // Instantiates a session client
  let config = { credentials: { private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCXpmJdB5wIB1rX\ndFM6TmfD5f6P+SZnw1BUtLAiqd7TmA42RTeFdUQ9dnd4qOu0fessCz3Fs1CUdcdz\nRuUgJeSsGquyw0oAKyuka04F+hHmrE1WgQU56m7hcHSFYTd8WLVlIJC3iWKnOZRS\nPI27FNEP5nmlC/4INQOrlfk2EZ1Z8hgJ2qpxbXe2M7FX5MXLHbuKPr41JBD0zEVz\n4Cv0PBYt2B9qrsoGjAYb88/4WdXbByS0lWp51EH0DOlUUPVaesdu08cvV9g+JEqz\ndPAYDFCTgADdXI42C/7LF+JJ+EGFJmopa7eA4DxXVGPV1vrVK1AT5VDdMv2PMIGe\nz7RvTSYlAgMBAAECggEACNgNOHuvH9C9/X6tM+NKreQF2oOfN8HuN2JqOztI4XIm\nsgeLW18hYaw8/25qgJYvVtw4+ASjGGVeAl0KE7viAB92D/DPqf7ahrYzUKnqzVcT\nE45mrZ/8Y21ZfkXTJI9P1Nv3VJzQggwbmEgrw9NM9e5s/bEbWYMt+Z2/cOXKFWqv\n6HYSW1BCORtAeUwfRU5aD4NOrl9T5nZXbyN1DkadUMH7jGqvHrz0OlI2iD5LuEsg\noQdiaiI8l4Eb7rnV298blU3k6FBuMolqLOTMIPlyxkvFqEdxG99G8DGYVzZtPQl/\nHkj4VTOab7yKhvM1dynBYgmR421X3CCgQD36hpq9qQKBgQDWJtM24UZy1NRYRKXK\nXlW5i7RxKDbRc/uGdSYLM+t/zDtJilJIqm+KtHb1g6fpqbVP0EIpMKMJV7qwGjys\nNIjOJnzqMY2m6PzHiCZpiO83sTR75EvN2kYgO8YfHkvXzgRUWgAhfA4OS/DH8Cu1\nit6XhF3/ocwbs/SNUvYY9u99OwKBgQC1SNdN9g5Ea6fZX5BkfSZb5DE0J7fpyDNZ\nOCMBsKnVQE2k0eDBkOMU+PCsNWjqi6/PheGxcZreNEDYpt8QXkc1q+hUvSGAThST\nfeVMKs4TrTWv1ku8QGtB3E+3mIhY30W1X2w25ROTw+wZDRJCUXOqxspv16b2p+T8\n8hSh/sc0HwKBgQCkhqOS8DQdmOGjBuqQtTULHgf9P7YN6Rt+y5X02Wi+gHu0Hi7l\nYPvdBpS2PvXMEPQZY5jQ6Gr5jIsDLMUcUCgiqXMiwftgFnPOIA3S2r9efCgkXtrW\nRjHGJeYqli4SmFa/L34WO6bY2QMduKj8CrrEkY9eDEIxrmneAbTMrTqFbQKBgDWr\nLOKNt8eVv4lg+1RkoJiPw+lW4OG7PUhqkCKN9JmHgfULlWh4xmGNGWNCJJ9bX18m\nmZx4r4qdGZ2KOXuVDavcCtoba/GaLAlGOj4EZiH5I229GYrP33EOEiOeaq802mRJ\nrbXKt7MFS75W2lL73ixu0buusmVPa0FfQbB7xumtAoGAEIpWXhkDWwnykTn2Do7z\n/t1kZTgd+uUa7Pp1wRT8aqXSz3rnY0AuaCnRxHLVkTQAgfqjEwlOXfDEmS4v46uC\nZJqtqDBHNtXyPYlUmG4dSl9sJjcDvpZF8m2RAFNnzNL5E6VEkGfMpeYxVpBcvcH2\nuvdIQF7uNXA7zWzKZbpzfCs=\n-----END PRIVATE KEY-----\n", client_email: 'testbot-8ab5a@appspot.gserviceaccount.com' } }

  const sessionClient = new dialogflow.SessionsClient(config);

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const projectId = 'ID of GCP project associated with your Dialogflow agent';
  // const sessionId = `user specific ID of session, e.g. 12345`;
  // const query = `phrase(s) to pass to detect, e.g. I'd like to reserve a room for six people`;
  // const languageCode = 'BCP-47 language code, e.g. en-US';

  // Define session path
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
    queryParams: {
      sentimentAnalysisRequestConfig: {
        analyzeQueryTextSentiment: true,
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  console.log('intent Detection Confidence:');
  console.log(responses[0].queryResult.intentDetectionConfidence);
  
  if (responses[0].queryResult.intentDetectionConfidence < 0.7) 
  {
    console.log('----------------------------');
    if (responses[0].alternativeQueryResults && responses[0].alternativeQueryResults[0] && responses[0].alternativeQueryResults[0].knowledgeAnswers && responses[0].alternativeQueryResults[0].knowledgeAnswers.answers) {

      console.log(responses[0].alternativeQueryResults[0].knowledgeAnswers.answers[0].faqQuestion);
      if (responses[0].alternativeQueryResults[0].knowledgeAnswers.answers[1]) {
        console.log(responses[0].alternativeQueryResults[0].knowledgeAnswers.answers[1].faqQuestion);
      }
      if (responses[0].alternativeQueryResults[0].knowledgeAnswers.answers[2]) {
        console.log(responses[0].alternativeQueryResults[0].knowledgeAnswers.answers[2].faqQuestion);
      }
      // console.log(responses[0].alternativeQueryResults[0].knowledgeAnswers.answers[2].faqQuestion);
      // console.log(responses[0].alternativeQueryResults[0].knowledgeAnswers.answers[0].faqQuestion);
      // console.log(responses[0].alternativeQueryResults[0].knowledgeAnswers.answers[1].faqQuestion);
      // console.log(responses[0].alternativeQueryResults[0].knowledgeAnswers.answers);
      //  console.log(responses[0].alternativeQueryResults[0]);
    }
  }
  console.log('----------------------------');

  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  if (result.sentimentAnalysisResult) {
    console.log(`Detected sentiment`);
    console.log(
      `  Score: ${result.sentimentAnalysisResult.queryTextSentiment.score}`
    );
    console.log(
      `  Magnitude: ${
      result.sentimentAnalysisResult.queryTextSentiment.magnitude
      }`
    );
  } else {
    console.log(`No sentiment Analysis Found`);
  }
  return responses;
  // [END dialogflow_detect_intent_with_sentiment_analysis]
}

async function detectIntentwithTexttoSpeechResponse(
  projectId,
  sessionId,
  query,
  languageCode,
  outputFile
) {
  // [START dialogflow_detect_intent_with_texttospeech_response]
  // Imports the Dialogflow client library
  const dialogflow = require('dialogflow').v2beta1;

  // Instantiate a DialogFlow client.
  const sessionClient = new dialogflow.SessionsClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const projectId = 'ID of GCP project associated with your Dialogflow agent';
  // const sessionId = `user specific ID of session, e.g. 12345`;
  // const query = `phrase(s) to pass to detect, e.g. I'd like to reserve a room for six people`;
  // const languageCode = 'BCP-47 language code, e.g. en-US';
  // const outputFile = `path for audio output file, e.g. ./resources/myOutput.wav`;

  // Define session path
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  const fs = require(`fs`);

  // The audio query request
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
    outputAudioConfig: {
      audioEncoding: `OUTPUT_AUDIO_ENCODING_LINEAR_16`,
    },
  };

  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent:');
  const audioFile = responses[0].outputAudio;
  await util.promisify(fs.writeFile)(outputFile, audioFile, 'binary');
  console.log(`Audio content written to file: ${outputFile}`);
  // [END dialogflow_detect_intent_with_texttospeech_response]
}

async function detectIntentKnowledge(
  projectId,
  sessionId,
  languageCode,
  knowledgeBaseFullName,
  query
) {
  // [START dialogflow_detect_intent_knowledge]
  // Imports the Dialogflow client library
  const dialogflow = require('dialogflow').v2beta1;

  // Instantiate a DialogFlow client.
  const sessionClient = new dialogflow.SessionsClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const projectId = 'ID of GCP project associated with your Dialogflow agent';
  // const sessionId = `user specific ID of session, e.g. 12345`;
  // const languageCode = 'BCP-47 language code, e.g. en-US';
  // const knowledgeBaseFullName = `the full path of your knowledge base, e.g my-Gcloud-project/myKnowledgeBase`;
  // const query = `phrase(s) to pass to detect, e.g. I'd like to reserve a room for six people`;

  // Define session path
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  const knowbase = new dialogflow.KnowledgeBasesClient();
  const knowledgeBasePath = knowbase.knowledgeBasePath(
    projectId,
    knowledgeBaseFullName
  );

  // The audio query request
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
    queryParams: {
      knowledgeBaseNames: [knowledgeBasePath],
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  console.log(`Query text: ${result.queryText}`);
  console.log(`Detected Intent: ${result.intent.displayName}`);
  console.log(`Confidence: ${result.intentDetectionConfidence}`);
  console.log(`Query Result: ${result.fulfillmentText}`);
  const answers = result.knowledgeAnswers.answers;
  console.log(`There are ${answers.length} anwser(s);`);
  answers.forEach(a => {
    console.log(`   answer: ${a.answer}`);
    console.log(`   confidence: ${a.matchConfidence}`);
    console.log(`   match confidence level: ${a.matchConfidenceLevel}`);
  });
  // [END dialogflow_detect_intent_knowledge]
}

async function detectIntentwithModelSelection(
  projectId,
  sessionId,
  audioFilePath,
  languageCode,
  model
) {
  // [START dialogflow_detect_intent_with_model_selection]
  const fs = require('fs');

  // Imports the Dialogflow client library
  const dialogflow = require('dialogflow').v2beta1;

  // Instantiate a DialogFlow client.
  const sessionClient = new dialogflow.SessionsClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const projectId = 'ID of GCP project associated with your Dialogflow agent';
  // const sessionId = `user specific ID of session, e.g. 12345`;
  // const audioFilePath = `path to local audio file, e.g. ./resources/book_a_room.wav`;
  // const languageCode = 'BCP-47 language code, e.g. en-US';
  // const model = `speech mode selected for given request, e.g. video, phone_call, command_and_search, default`;

  // Define session path
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  // Read the content of the audio file and send it as part of the request.
  const readFile = util.promisify(fs.readFile);
  const inputAudio = await readFile(audioFilePath);
  const request = {
    session: sessionPath,
    queryInput: {
      audioConfig: {
        audioEncoding: `AUDIO_ENCODING_LINEAR_16`,
        sampleRateHertz: 16000,
        languageCode: languageCode,
        model: model,
      },
    },
    inputAudio: inputAudio,
  };
  // Recognizes the speech in the audio and detects its intent.
  const responses = await sessionClient.detectIntent(request);
  const contextClient = new dialogflow.ContextsClient();
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  const parameters = JSON.stringify(struct.decode(result.parameters));
  console.log(`  Parameters: ${parameters}`);
  if (result.outputContexts && result.outputContexts.length) {
    console.log(`  Output contexts:`);
    result.outputContexts.forEach(context => {
      const contextId = contextClient.matchContextFromContextName(context.name);
      const contextParameters = JSON.stringify(
        struct.decode(context.parameters)
      );
      console.log(`    ${contextId}`);
      console.log(`      lifespan: ${context.lifespanCount}`);
      console.log(`      parameters: ${contextParameters}`);
    });
  }
  // [END dialogflow_detect_intent_with_model_selection]
}




