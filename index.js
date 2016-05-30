"use strict";
const https = require('https');
const telegram = require('node-telegram-bot-api');
const bot = new telegram(process.env.TOKEN, { polling: true });

let people = [];

https.get('https://says.marcusnoble.co.uk/people', (res) => {
  let inputStream = '';
  res.on('data', (chunk) => {
    inputStream += chunk;
  });
  res.on('end', () => {
    people = JSON.parse(inputStream);
  })
});

bot.on('inline_query', function(message) {
  let text = encodeURIComponent(message.query);
  if(text) {
    let results = [];
    for(let person of people) {
      results.push({
        type: 'photo',
        id: `${person}/${text}`,
        photo_url: `https://says.marcusnoble.co.uk/${person}/${text}`,
        thumb_url: `https://says.marcusnoble.co.uk/${person}/${text}`
      });
    }
    bot.answerInlineQuery(message.id, results);
  }
});