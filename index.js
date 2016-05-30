"use strict";
const http = require('http');
const telegram = require('node-telegram-bot-api');
const bot = new telegram(process.env.TOKEN, { polling: true });

let people = [];

http.get('http://says.marcusnoble.co.uk/people', (res) => {
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
    let people = ['ben', 'ryan', 'seren', 'ruth', 'dan', 'pete'];
    for(let person of people) {
      results.push({
        type: 'photo',
        id: `${person}/${text}`,
        photo_url: `http://says.marcusnoble.co.uk/${person}/${text}`,
        thumb_url: `http://says.marcusnoble.co.uk/${person}/${text}`
      });
    }
    bot.answerInlineQuery(message.id, results);
  }
});