import { Trainer } from '../../model/trainer';
import { User } from '../../model/user';
import { Pokemon } from '../../model/pokemon';
import { Badge } from '../../model/badge';
import { GymBattle } from '../../model/gymBattle';

import { Role } from '@prisma/client';

describe('Trainer Class', () => {
  // Mock instances of User, Pokemon, Badge, and GymBattle for testing
  const user1 = new User({
    id: 45,
    firstName: 'Red',
    lastName: 'pokemon',
    email: 'red@gmail.com',
    password: '$2b$10$DdWxPsfDV9oZEFWzIyowOegTADKb5dIKZSr39IDF2KzMk5ivn/3ZW',
    role: Role.trainer,
  });

  const user2 = new User({
    id: 46,
    firstName: 'Blue',
    lastName: 'pokemon',
    email: 'blue@gmail.com',
    password: '$2b$10$gJZ6riKhH9MbRw7WTjogQOaCFXvtF/1g0iM9iSz5OYI/u6ySSi7D6',
    role: Role.trainer,
  });

  // Mock Pokemon instances
  const charizard = new Pokemon({
    id: 57,
    name: 'charizard',
    type: 'fire/flying',
    stats: {
      hp: 200,
      attack: 150,
      defence: 120,
      specialAttack: 140,
      specialDefence: 140,
      speed: 60,
    },
    health: 200,
    canEvolve: false,
  });

  const rattata = new Pokemon({
    id: 58,
    name: 'rattata',
    type: 'normal',
    stats: {
      hp: 50,
      attack: 55,
      defence: 40,
      specialAttack: 30,
      specialDefence: 24,
      speed: 75,
    },
    health: 50,
    canEvolve: true,
  });

  const blastoise = new Pokemon({
    id: 59,
    name: 'blastoise',
    type: 'water',
    stats: {
      hp: 250,
      attack: 140,
      defence: 130,
      specialAttack: 100,
      specialDefence: 150,
      speed: 65,
    },
    health: 250,
    canEvolve: false,
  });

  // Mock Badge instances
  const cascadeBadge = new Badge({
    id: 33,
    name: 'Cascade badge',
    location: 'Cerulean City',
    difficulty: 1,
  });

  const boulderBadge = new Badge({
    id: 31,
    name: 'Boulder badge',
    location: 'Pewter City',
    difficulty: 1,
  });

  // Mock GymBattle instances (empty in this case)
  const gymBattle1 = new GymBattle({
    id: 1,
    date: new Date('2024-12-20'),
    time: new Date('2024-12-20T10:00:00Z'),
    badge: cascadeBadge,
  });

  // Create trainer instances based on the mock data
  const trainer1 = new Trainer({
    user: user1,
    pokemon: [charizard],
    badges: [cascadeBadge],
    gymBattles: [],
  });

  const trainer2 = new Trainer({
    user: user2,
    pokemon: [rattata, blastoise],
    badges: [cascadeBadge, boulderBadge],
    gymBattles: [],
  });

  test('should create a Trainer instance correctly', () => {
    expect(trainer1.getUser()).toBe(user1);
    expect(trainer1.getPokemon()).toEqual([charizard]);
    expect(trainer1.getBadges()).toEqual([cascadeBadge]);
    expect(trainer1.getGymBattles()).toEqual([]);
    
    expect(trainer2.getUser()).toBe(user2);
    expect(trainer2.getPokemon()).toEqual([rattata, blastoise]);
    expect(trainer2.getBadges()).toEqual([cascadeBadge, boulderBadge]);
    expect(trainer2.getGymBattles()).toEqual([]);
  });

  test('should check equality of two Trainers', () => {
    const trainer3 = new Trainer({
      user: user1,
      pokemon: [charizard],
      badges: [cascadeBadge],
      gymBattles: [],
    });

    const trainer4 = new Trainer({
      user: user2,
      pokemon: [rattata, blastoise],
      badges: [cascadeBadge, boulderBadge],
      gymBattles: [],
    });

    expect(trainer1.equals(trainer3)).toBe(true); // should be equal
    expect(trainer2.equals(trainer4)).toBe(true); // should be equal
    expect(trainer1.equals(trainer2)).toBe(false); // should not be equal
  });
});
