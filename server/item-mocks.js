const uuid = require('uuid');

function buildItem(name, pokemonId, price, happiness, imageUrl) {
  return {
    id: uuid.v4(),
    name,
    pokemonId,
    price,
    happiness,
    imageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

var itemNames = [
  'Oran Berry',
  'Air Balloon',
  'Amulet Coin',
  'Black Belt',
  'Black Glasses',
  'Charcoal',
  'Cleanse Tag',
  'Destiny Knot',
  'Dragon Fang',
  'Everstone',
  'Flame Orb',
  'Focus Band',
  'Grassy Seed',
  "King's Rock",
  'Lucky Egg',
  'Magnet',
  'Soothe Bell',
  'Pokemon Egg',
];
var itemImageUrls = [
  'https://static.giantbomb.com/uploads/square_medium/14/140474/2185101-baya_aranja_grande.png',
  'https://thumbs.dreamstime.com/b/red-green-blue-helium-balloons-set-isolated-transparent-background-balloon-birthday-baloon-flying-party-celebrations-98446709.jpg',
  'https://i0.wp.com/3.bp.blogspot.com/-N5HwBRxnyjk/V5tp0Cst4nI/AAAAAAAAnzg/J22q_lbPzv0A27sLzoPCcIIFPn-R1-4fgCK4B/s1600/enhanced-buzz-9890-1432569203-0.jpg',
  'http://www.stickpng.com/assets/images/580b57fbd9996e24bc43bed6.png',
  'https://image.freepik.com/free-vector/realistic-retro-sun-glasses-with-transparent-background_6431-90.jpg',
  'https://img.clipartxtras.com/3b0cb80295c37d58b71657328444359f_image-charcoal-homepng-ark-survival-plus-wikia-fandom-charcoal-clipart-png_932-780.png',
  'http://pokemon3d.net/wiki/images/0/0d/Cleanse_Tag_big.png',
  'http://pm1.narvii.com/6351/fa2f1b38b5ea872ec8a42baad0180fb2a876647f_00.jpg',
  'http://cimg.tvgcdn.net/i/2017/07/06/0c4aa446-c607-4da8-8595-d1f9a88e58be/2f948a40862468b2d291fc421db26025/gameofthrones-news.jpg',
  'https://t6.rbxcdn.com/daafbbcb7b36f84b8d7f6b8cf4a3e9ae',
  'http://poketudo.com/app/pokedex/files/images/og/flame-orb.png',
  'https://cdn.bulbagarden.net/upload/0/09/Dream_Choice_Band_Sprite.png',
  'https://vignette.wikia.nocookie.net/pokelist/images/d/de/Sunkern.png/revision/latest?cb=20161016125710',
  'https://vignette.wikia.nocookie.net/pokemongo/images/f/ff/King%27s_Rock.png/revision/latest?cb=20170215214501',
  'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Lucky-Eggs.png',
  'http://www.stickpng.com/assets/images/59aeb09032bcd87615d27972.png',
  'https://media-cerulean.cursecdn.com/attachments/15/986/635969371927074561.png',
  'https://rebekahlang.files.wordpress.com/2015/08/pokemon-egg-png.png',
];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

exports.buildRandomItem = function buildRandomItem(pokemonId) {
  itemIdx = getRandomInt(itemNames.length);

  return buildItem(
    itemNames[itemIdx],
    pokemonId,
    getRandomInt(100),
    getRandomInt(100),
    itemImageUrls[itemIdx],
  );
}