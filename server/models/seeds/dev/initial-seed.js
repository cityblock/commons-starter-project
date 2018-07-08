var uuid = require('uuid');

function deleteTables(knex, Promise) {
  return knex.transaction(function(trx) {
    const deletePromises = trx
      .withSchema('information_schema')
      .select('table_name')
      .from('tables')
      .whereRaw(`table_catalog = ? AND table_schema = ? AND table_name != ?`, [
        trx.client.database(),
        'public',
        'knex_migrations',
      ])
      .map(function(row) {
        return trx.raw(`TRUNCATE TABLE public.${row.table_name} CASCADE`);
      });

    return Promise.all(deletePromises);
  });
}

function buildPokemon(name, pokemonNumber, attack, defense, pokeType, moves, imageUrl) {
  return {
    id: uuid.v4(),
    name,
    pokemonNumber,
    attack,
    defense,
    pokeType,
    moves: JSON.stringify(moves),
    imageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

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

function buildRandomItem(pokemonId) {
  itemIdx = getRandomInt(itemNames.length);

  return buildItem(
    itemNames[itemIdx],
    pokemonId,
    getRandomInt(100),
    getRandomInt(100),
    itemImageUrls[itemIdx],
  );
}

function createItems(knex, Promise) {
  return knex
    .table('pokemon')
    .pluck('id')
    .then(function(pokemonIds) {
      const itemPromises = [];
      for (let i = 0; i < pokemonIds.length; i++) {
        for (let j = 0; j < 3; j++) {
          itemPromises.push(knex.table('item').insert(buildRandomItem(pokemonIds[i])));
        }
      }
      return Promise.all(itemPromises);
    });
}

const seed = function(knex, Promise) {
  return knex
    .table('pokemon')
    .insert([
      buildPokemon(
        'Bulbasaur',
        1,
        11,
        22,
        'grass',
        ['Tackle', 'Growl', 'Leech Seed'],
        'https://cdn.bulbagarden.net/upload/thumb/2/21/001Bulbasaur.png/1200px-001Bulbasaur.png',
      ),
      buildPokemon(
        'Ivysaur',
        2,
        33,
        44,
        'grass',
        ['Poisonpower', 'Vine Whip'],
        'https://cdn.bulbagarden.net/upload/7/73/002Ivysaur.png',
      ),
      buildPokemon(
        'Venusaur',
        3,
        45,
        54,
        'grass',
        ['Venoshock', 'Solar Beam'],
        'https://cdn.bulbagarden.net/upload/thumb/a/ae/003Venusaur.png/500px-003Venusaur.png',
      ),
      buildPokemon(
        'Charmander',
        4,
        15,
        12,
        'fire',
        ['Scratch', 'Leer', 'Ember'],
        'https://cdn.bulbagarden.net/upload/thumb/7/73/004Charmander.png/500px-004Charmander.png',
      ),
      buildPokemon(
        'Charmeleon',
        5,
        24,
        20,
        'fire',
        ['Slash', 'Flame Wheel'],
        'https://cdn.bulbagarden.net/upload/4/4a/005Charmeleon.png',
      ),
      buildPokemon(
        'Charizard',
        6,
        60,
        42,
        'fire',
        ['Dragon Rage', 'Flamethrower', 'Fly'],
        'https://cdn.bulbagarden.net/upload/thumb/7/7e/006Charizard.png/1200px-006Charizard.png',
      ),
      buildPokemon(
        'Squirtle',
        7,
        16,
        9,
        'water',
        ['Tackle', 'Tail Whip', 'Water Gun'],
        'https://cdn.bulbagarden.net/upload/thumb/3/39/007Squirtle.png/500px-007Squirtle.png',
      ),
      buildPokemon(
        'Wartortle',
        8,
        28,
        24,
        'water',
        ['Bite', 'Bubblebeam'],
        'https://cdn.bulbagarden.net/upload/0/0c/008Wartortle.png',
      ),
      buildPokemon(
        'Blastoise',
        9,
        60,
        52,
        'water',
        ['Hydro Pump', 'Skull Bash', 'Surf'],
        'https://cdn.bulbagarden.net/upload/thumb/0/02/009Blastoise.png/1200px-009Blastoise.png',
      ),
      buildPokemon(
        'Eevee',
        133,
        25,
        25,
        'normal',
        ['Swift', 'Take Down'],
        'https://cdn.bulbagarden.net/upload/thumb/e/e2/133Eevee.png/500px-133Eevee.png',
      ),
      buildPokemon(
        'Meowth',
        52,
        18,
        20,
        'normal',
        ['Fury Swipes', 'Pay Day'],
        'https://cdn.bulbagarden.net/upload/thumb/d/d6/052Meowth.png/500px-052Meowth.png',
      ),
      buildPokemon(
        'Persian',
        53,
        34,
        28,
        'normal',
        ['Slash', 'Nasty Plot'],
        'https://cdn.bulbagarden.net/upload/1/13/053Persian.png',
      ),
      buildPokemon(
        'Pikachu',
        25,
        25,
        25,
        'electric',
        ['Thundershock', 'Thunder Wave'],
        'https://cdn.bulbagarden.net/upload/thumb/0/0d/025Pikachu.png/500px-025Pikachu.png',
      ),
      buildPokemon(
        'Raichu',
        26,
        51,
        47,
        'electric',
        ['Thunderbolt', 'Thunder'],
        'https://cdn.bulbagarden.net/upload/thumb/8/88/026Raichu.png/500px-026Raichu.png',
      ),
      buildPokemon(
        'Abra',
        63,
        15,
        14,
        'psychic',
        ['Teleport'],
        'hhttps://cdn.bulbagarden.net/upload/6/62/063Abra.png',
      ),
      buildPokemon(
        'Kadabra',
        64,
        27,
        30,
        'psychic',
        ['Psyshock', 'Light Screen'],
        'https://cdn.bulbagarden.net/upload/9/97/064Kadabra.png',
      ),
      buildPokemon(
        'Alakazam',
        65,
        56,
        48,
        'psychic',
        ['Psychic', 'Future Sight'],
        'https://cdn.bulbagarden.net/upload/c/cc/065Alakazam.png',
      ),
      buildPokemon(
        'Mew',
        151,
        100,
        100,
        'psychic',
        ['Ancient Power', 'Aura Sphere'],
        'https://cdn.bulbagarden.net/upload/thumb/b/b1/151Mew.png/1200px-151Mew.png',
      ),
      buildPokemon(
        'Gastly',
        92,
        22,
        11,
        'ghost',
        ['Hypnosis', 'Lick'],
        'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
      ),
      buildPokemon(
        'Haunter',
        93,
        32,
        25,
        'ghost',
        ['Curse', 'Night Shade'],
        'https://cdn.bulbagarden.net/upload/6/62/093Haunter.png',
      ),
      buildPokemon(
        'Gengar',
        94,
        50,
        32,
        'ghost',
        ['Dream Eater', 'Nightmare'],
        'https://cdn.bulbagarden.net/upload/c/c6/094Gengar.png',
      ),
      buildPokemon(
        'Umbreon',
        197,
        65,
        58,
        'dark',
        ['Pursuit', 'Feint Attack'],
        'https://cdn.bulbagarden.net/upload/thumb/3/3d/197Umbreon.png/1200px-197Umbreon.png',
      ),
      buildPokemon(
        'Clefairy',
        35,
        24,
        28,
        'fairy',
        ['Metronome', 'Sing'],
        'https://cdn.bulbagarden.net/upload/f/f4/035Clefairy.png',
      ),
      buildPokemon(
        'Clefable',
        36,
        50,
        55,
        'fairy',
        ['Moonbeam', 'Rest'],
        'https://cdn.bulbagarden.net/upload/a/a9/036Clefable.png',
      ),
      buildPokemon(
        'Sylveon',
        700,
        54,
        49,
        'fairy',
        ['Dazzling Gleam', 'Charm'],
        'https://cdn.bulbagarden.net/upload/thumb/e/e8/700Sylveon.png/500px-700Sylveon.png',
      ),
      buildPokemon(
        'Onix',
        95,
        41,
        68,
        'rock',
        ['Rock Slide', 'Defense Curl'],
        'https://cdn.bulbagarden.net/upload/thumb/9/9a/095Onix.png/1200px-095Onix.png',
      ),
      buildPokemon(
        'Cubone',
        104,
        22,
        33,
        'ground',
        ['Bone Club', 'Headbutt'],
        'https://cdn.bulbagarden.net/upload/2/2a/104Cubone.png',
      ),
      buildPokemon(
        'Marowak',
        105,
        44,
        55,
        'ground',
        ['Bonemerang', 'Rage'],
        'https://cdn.bulbagarden.net/upload/9/98/105Marowak.png',
      ),
      buildPokemon(
        'Steelix',
        208,
        51,
        80,
        'steel',
        ['Iron Tail', 'Iron Defense'],
        'https://cdn.bulbagarden.net/upload/b/ba/208Steelix.png',
      ),
      buildPokemon(
        'Pidgey',
        16,
        9,
        11,
        'flying',
        ['Gust', 'Sand Attack'],
        'https://cdn.bulbagarden.net/upload/thumb/5/55/016Pidgey.png/500px-016Pidgey.png',
      ),
      buildPokemon(
        'Pidgeotto',
        17,
        22,
        18,
        'flying',
        ['Whirlwind', 'Twiter'],
        'https://cdn.bulbagarden.net/upload/thumb/7/7a/017Pidgeotto.png/500px-017Pidgeotto.png',
      ),
      buildPokemon(
        'Pidgeot',
        18,
        46,
        38,
        'flying',
        ['Wing Attack', 'Air Slash'],
        'https://cdn.bulbagarden.net/upload/thumb/5/57/018Pidgeot.png/1200px-018Pidgeot.png',
      ),
      buildPokemon(
        'Caterpie',
        10,
        6,
        7,
        'bug',
        ['String Shot', 'Tackle'],
        'https://cdn.bulbagarden.net/upload/5/5d/010Caterpie.png',
      ),
      buildPokemon(
        'Metapod',
        11,
        9,
        20,
        'bug',
        ['Harden'],
        'https://cdn.bulbagarden.net/upload/c/cd/011Metapod.png',
      ),
      buildPokemon(
        'Butterfree',
        12,
        34,
        42,
        'bug',
        ['Sleep Powder', 'Stun Spore', 'Bug Buzz'],
        'https://cdn.bulbagarden.net/upload/d/d1/012Butterfree.png',
      ),
      buildPokemon(
        'Vulpix',
        37,
        22,
        33,
        'ice',
        ['Powder Snow', 'Icy Wind'],
        'https://cdn.bulbagarden.net/upload/thumb/3/35/037Vulpix-Alola.png/1200px-037Vulpix-Alola.png',
      ),
      buildPokemon(
        'Ninetails',
        38,
        41,
        47,
        'ice',
        ['Aurora Beam', 'Blizzard'],
        'https://cdn.bulbagarden.net/upload/thumb/2/26/038Ninetales-Alola.png/1200px-038Ninetales-Alola.png',
      ),
      buildPokemon(
        'Dratini',
        147,
        32,
        38,
        'dragon',
        ['Dragon Rage', 'Slam'],
        'https://cdn.bulbagarden.net/upload/c/cc/147Dratini.png',
      ),
      buildPokemon(
        'Dragonair',
        148,
        44,
        54,
        'dragon',
        ['Dragon Tail', 'Aqua Tail'],
        'https://cdn.bulbagarden.net/upload/9/93/148Dragonair.png',
      ),
      buildPokemon(
        'Dragonite',
        149,
        75,
        72,
        'dragon',
        ['Dragon Dance', 'Hyper Beam'],
        'https://cdn.bulbagarden.net/upload/8/8b/149Dragonite.png',
      ),
      buildPokemon(
        'Nidoran',
        29,
        22,
        28,
        'poison',
        ['Double Kick', 'Poison Sting'],
        'https://cdn.bulbagarden.net/upload/8/81/029Nidoran.png',
      ),
      buildPokemon(
        'Nidorina',
        30,
        43,
        50,
        'poison',
        ['Fury Swipes', 'Toxic Spikes'],
        'https://cdn.bulbagarden.net/upload/c/cd/030Nidorina.png',
      ),
      buildPokemon(
        'Nidoqueen',
        31,
        70,
        80,
        'poison',
        ['Earthquake', 'Poison Fang'],
        'https://cdn.bulbagarden.net/upload/b/bf/031Nidoqueen.png',
      ),
    ]);
};

exports.seed = function(knex, Promise) {
  return deleteTables(knex, Promise).then(function() {
    return seed(knex, Promise).then(function() {
      return createItems(knex, Promise);
    });
  });
};
