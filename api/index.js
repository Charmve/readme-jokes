const jokes = require('../src/jokes.json');
const kafkas = require('../src/kafka.json');
const { CONSTANTS, getRandomArrayElement } = require('../src/utils');
const { qnaCard, quoteCard } = require('../src/renderJokesCard');
const themes = require('../src/themes.json');

// Max cache age (Currently = 60 seconds)
const cacheSeconds = CONSTANTS.TEN_SECONDS;

module.exports = async (req, res) => {
  //const index = 168
  let renderJoke = '';

  let {
    borderColor, qColor, aColor, textColor, bgColor, codeColor, quoteColor, theme, hideBorder,
  } = req.query;

  theme = theme ? theme.toLowerCase() : theme;

  if (theme === 'random') theme = getRandomArrayElement(Object.keys(themes));

  if (!themes[theme]) theme = 'default';
  const colorTheme = themes[theme];
  borderColor = borderColor || colorTheme.borderColor;
  bgColor = bgColor || colorTheme.bgColor;
  qColor = qColor || colorTheme.qColor;
  aColor = aColor || colorTheme.aColor;
  quoteColor = quoteColor || colorTheme.quoteColor;
  codeColor = codeColor || colorTheme.codeColor;

  if ( Math.floor(Math.random() * 100) % 2 === 0) {
    const index = Math.floor(Math.random() * Object.keys(jokes).length);

    if (jokes[index].q) {
      const question = jokes[index].q;
      const answer = jokes[index].a;
      renderJoke = qnaCard(
        qColor || '#ffca3a',
        aColor || '#8ac926',
        bgColor || '#242423',
        borderColor || '#8ac926',
        codeColor || '#f72585',
        question,
        answer,
        hideBorder,
      );
    } else {
      let joke = jokes[index];
      
      if (joke.includes("<br")) joke = jokes[index]
      else {
        joke = jokes[index].split('?"');
        if (joke.length===2) joke = joke[0] + '?"' + "<br/><br/>" + joke[1];
        else joke = jokes[index];
      }

      renderJoke = quoteCard(
        textColor || '#ffca3a',
        bgColor || '#242423',
        borderColor || '#8ac926',
        codeColor || '#f72585',
        joke,
        hideBorder,
      );
    }
  } else {
    const index = Math.floor(Math.random() * Object.keys(kafkas).length);
    let kafka = kafkas[index];

    if (kafka.includes("<br")) kafka = kafkas[index]
    else {
      kafka = kafkas[index].split('?"');
      if (kafka.length===2) kafka = kafka[0] + '?"' + "<br/><br/>" + kafka[1];
      else kafka = kafkas[index];
    }

   renderJoke = quoteCard(
     textColor || '#ffca3a',
     bgColor || '#242423',
     borderColor || '#8ac926',
     codeColor || '#f72585',
     kafka,
     hideBorder,
   );
  }

  // Sets the type of content sent
  res.setHeader('Content-Type', 'image/svg+xml');
  // Set the Cache type to public (Any cache can store the data) and the max-age
  res.setHeader('Cache-Control', `public, max-age=${cacheSeconds}`);
  res.send(renderJoke);
};
