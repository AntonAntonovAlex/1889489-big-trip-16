import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const offerTypes = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const offer = {
  'taxi': [
    {
      'id' : 1,
      'title': 'Switch to comfort',
      'price': 120,
      'selected' : Boolean(getRandomInteger(0, 1)),
    }, {
      'id' : 2,
      'title': 'Choose the radio station',
      'price': 60,
      'selected' : Boolean(getRandomInteger(0, 1))
    }
  ],
  'check-in': [],
  'train': [
    {
      'id' : 1,
      'title': 'Switch to comfort',
      'price': 200,
      'selected' : Boolean(getRandomInteger(0, 1))
    }, {
      'id' : 2,
      'title': 'Add meal',
      'price': 10,
      'selected' : Boolean(getRandomInteger(0, 1))
    }, {
      'id' : 3,
      'title': 'Choose seats',
      'price': 20,
      'selected' : Boolean(getRandomInteger(0, 1))
    }
  ],
  'ship': [
    {
      'id' : 1,
      'title': 'Travel by train',
      'price': 420,
      'selected' : Boolean(getRandomInteger(0, 1))
    }
  ],
  'drive': [
    {
      'id' : 1,
      'title': 'Choose seats',
      'price': 120,
      'selected' : Boolean(getRandomInteger(0, 1))
    }, {
      'id' : 2,
      'title': 'Choose the radio station',
      'price': 80,
      'selected' : Boolean(getRandomInteger(0, 1))
    }, {
      'id' : 3,
      'title': 'Switch to comfort',
      'price': 45,
      'selected' : Boolean(getRandomInteger(0, 1))
    }
  ],
  'flight': [
    {
      'id' : 1,
      'title': 'Switch to comfort',
      'price': 120,
      'selected' : Boolean(getRandomInteger(0, 1))
    }, {
      'id' : 2,
      'title': 'Add meal',
      'price': 60,
      'selected' : Boolean(getRandomInteger(0, 1))
    }, {
      'id' : 3,
      'title': 'Choose seats',
      'price': 30,
      'selected' : Boolean(getRandomInteger(0, 1))
    }, {
      'id' : 4,
      'title': 'Add luggage',
      'price': 65,
      'selected' : Boolean(getRandomInteger(0, 1))
    }
  ],
  'bus': [
    {
      'id' : 1,
      'title': 'Switch to comfort',
      'price': 75,
      'selected' : Boolean(getRandomInteger(0, 1))
    }, {
      'id' : 2,
      'title': 'Add meal',
      'price': 25,
      'selected' : Boolean(getRandomInteger(0, 1))
    }
  ],
  'sightseeing': [
    {
      'id' : 1,
      'title': 'Add meal',
      'price': 56,
      'selected' : Boolean(getRandomInteger(0, 1))
    }
  ],
  'restaurant': [
    {
      'id' : 1,
      'title': 'Choose seats',
      'price': 35,
      'selected' : Boolean(getRandomInteger(0, 1))
    }
  ],
};

const cities = [
  'Vienna',
  'Vancouver',
  'Munich',
  'Copenhagen',
  'Berlin',
];

const generateTypePoint = () => {
  const index = getRandomInteger(0, offerTypes.length - 1);

  return offerTypes[index];
};

const generateDestination = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    'Cras aliquet varius magna, non porta ligula feugiat eget. ',
    'Fusce tristique felis at fermentum pharetra. ',
    'Aliquam id orci ut lectus varius viverra. ',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
    'Sed sed nisi sed augue convallis suscipit in sed felis. ',
    'Aliquam erat volutpat. ',
    'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. ',
  ];
  let description = '';
  const randomValue = getRandomInteger(1, 5);
  for (let i = 0; i < randomValue; i++) {
    const index = getRandomInteger(0, descriptions.length - 1);
    description += descriptions[index];
  }
  return description;
};

const generateCity = () => {
  const index = getRandomInteger(0, cities.length - 1);
  return cities[index];
};

const generatePhoto = () => {
  const photos = [];
  const randomValue = getRandomInteger(1,10);
  for (let i = 0; i < randomValue; i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.floor(Math.random()*100)}`);
  }
  return photos;
};

export const generatePoint = () => {
  const typePoint = generateTypePoint();
  return {
    id: nanoid(),
    typePoint,
    destinationCity: generateCity(),
    offers: offer[typePoint],
    destination: generateDestination(),
    photos: generatePhoto(),
    price: getRandomInteger(1, 10000),
    startDate: dayjs().add(- Math.floor(Math.random()*10000), 'minute').toDate(),
    endDate: dayjs().add(Math.floor(Math.random()*1000), 'minute').toDate(),
    isFavorite: Boolean(getRandomInteger(0,1)),
  };
};
