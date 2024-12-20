import { Nurse } from '../../model/nurse'; 
import { User } from '../../model/user'; 
import { Pokemon } from '../../model/pokemon'; 
import { Role } from '@prisma/client';
import { Stats as StatsPrisma, Nurse as NursePrisma, User as UserPrisma, Pokemon as PokemonPrisma } from '@prisma/client';

describe('Nurse Class', () => {

  const userData = {
    id: 1,
    firstName: 'Nurse',
    lastName: 'Joy',
    email: 'joy@example.com',
    password: 'joypassword123',

    role: Role.nurse, 
  };

  const user = new User(userData); 


  const pokemonData = {
    id: 1,
    name: 'Pikachu',
    type: 'Electric',
    stats: {
      hp: 100,
      attack: 55,
      defence: 40,
      specialAttack: 50,
      specialDefence: 50,
      speed: 90,
    },
    health: 100,
    canEvolve: true,
  };

  const pokemon = new Pokemon(pokemonData); 


  const nurseData = {
    id: 1,
    user: user,
    pokemon: [pokemon], 
  };

  let nurse: Nurse;

  beforeEach(() => {
    nurse = new Nurse(nurseData);
  });

  test('should create a Nurse instance with valid data', () => {
    expect(nurse).toBeInstanceOf(Nurse);
    expect(nurse.getId()).toBe(1);

    expect(nurse.getUser()).toBe(user); 
    expect(nurse.getPokemon()).toEqual([pokemon]); 
  });

  test('should correctly compare two identical Nurse instances', () => {
    const anotherNurse = new Nurse(nurseData);
    expect(nurse.equals(anotherNurse)).toBe(true);
  });

  test('should return false for unequal Nurse instances', () => {
    const differentNurseData = { ...nurseData, user: new User({ id: 2, firstName: 'Nurse', lastName: 'Jenny', email: 'jenny@example.com', password: 'jenny123', role: 'nurse' }) };
    const differentNurse = new Nurse(differentNurseData);
    expect(nurse.equals(differentNurse)).toBe(false);
  });

  test('should create a Nurse instance using the from() static method', () => {
    const prismaNurseData: NursePrisma = {
      id: 1,

      userId: 1, 
    };

    const prismaUserData: UserPrisma = {
      id: 1,
      firstName: 'Nurse',
      lastName: 'Joy',
      email: 'joy@example.com',
      password: 'joypassword123',
      role: 'nurse',
    };

    const prismaPokemonData: PokemonPrisma = {
        id: 1,
        name: 'Pikachu',
        type: 'Electric',
        health: 100,
        canEvolve: true,

        statsId: 1, 
        nurseId: 1,
        previousTrainerId: 1,
        trainerId: 1
    };

    const prismaStatsData: StatsPrisma = {
        hp: 100,
        attack: 55,
        defence: 40,
        specialAttack: 50,
        specialDefence: 50,
        speed: 90,
        id: 0
    };

    // Mock the conversion of Prisma data into the Nurse class
    const createdNurse = Nurse.from({
      ...prismaNurseData,
      user: prismaUserData,
      pokemon: [
        { ...prismaPokemonData, stats: prismaStatsData }, // Attach stats to Pokemon
      ],
    });

    expect(createdNurse).toBeInstanceOf(Nurse);
    expect(createdNurse.getId()).toBe(prismaNurseData.id);
    expect(createdNurse.getUser()).toBeInstanceOf(User);
    expect(createdNurse.getUser().getFirstName()).toBe('Nurse');
    expect(createdNurse.getPokemon()).toEqual([pokemon]); // Check if Pokemon is properly mapped
  });
});
