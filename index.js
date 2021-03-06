const got = require("got");
const { Random } = require("random-js");

const random = new Random();
const maxfirstHitNotStoryIterations = 10;

exports.handler = async () => {
  const itemId = await getRandomHnArticleId();
  return itemId;
};

const getRandomHnArticleId = async () => {
  let topId = '';
  let randomItemId = '';
  let hits = 0;
  const response = await got(
    "https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty"
  );
  const topStoriesResponse = await got (
    'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
  );
  topId = response.body;
  while(true) {
    randomItemId = random.integer(1, topId);
    const itemResponse = await getItemMetadata(randomItemId);
    if(itemResponse.type === 'story' || itemResponse.type === 'poll') {
      break;
    };
    if (hits > maxfirstHitNotStoryIterations) {
      let topStoriesArray = JSON.parse(topStoriesResponse.body); 
      const randomItemIndex = random.integer(1, topStoriesArray.length-1);
      randomItemId = topStoriesArray[randomItemIndex];
      break;
    }
    hits++;
  }
  console.log(randomItemId);
  return randomItemId;
};

const getItemMetadata = async (id) => {
  const itemResponse = await got(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
  );
  return JSON.parse(itemResponse.body);
};