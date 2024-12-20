import { Pokemon } from '../../model/pokemon'; // Adjust the import path accordingly
import { Stats as StatsPrisma, Pokemon as PokemonPrisma } from '@prisma/client';

describe('Pokemon Class', () => {

  const statsData: StatsPrisma = {
    id: 1,
    hp: 100,
    attack: 55,
    defence: 40,
    specialAttack: 50,
    specialDefence: 50,
    speed: 90,
  };

  const pokemonPrismaData: PokemonPrisma = {
      id: 1,
      name: 'Pikachu',
      type: 'Electric',
      health: 100,
      canEvolve: true,
      previousTrainerId: null,
      trainerId: null,
      nurseId: null,
      statsId: 0
  };

  const pokemonData = {
    id: 1,
    name: 'Pikachu',
    type: 'Electric',
    stats: statsData,
    health: 100,
    canEvolve: true,
  };

  let pokemon: Pokemon;

  beforeEach(() => {
    pokemon = new Pokemon(pokemonData);
  });

  test('should create a Pokemon instance with valid data', () => {
    expect(pokemon).toBeInstanceOf(Pokemon);
    expect(pokemon.getId()).toBe(1);
    expect(pokemon.getName()).toBe('Pikachu');
    expect(pokemon.getType()).toBe('Electric');
    expect(pokemon.getHealth()).toBe(100);
    expect(pokemon.getCanEvolve()).toBe(true);
    expect(pokemon.getStats()).toEqual(statsData);
  });

  test('should correctly compare two identical Pokemon instances', () => {
    const anotherPokemon = new Pokemon(pokemonData);
    expect(pokemon.equals(anotherPokemon)).toBe(true);
  });

  test('should return false for unequal Pokemon instances', () => {
    const differentStatsData: StatsPrisma = {
      id: 2,
      hp: 120,
      attack: 60,
      defence: 50,
      specialAttack: 60,
      specialDefence: 55,
      speed: 100,
    };

    const differentPokemonData = { ...pokemonData, stats: differentStatsData };
    const differentPokemon = new Pokemon(differentPokemonData);

    expect(pokemon.equals(differentPokemon)).toBe(false);
  });

  test('should create a Pokemon instance using the from() static method', () => {
    const createdPokemon = Pokemon.from(pokemonPrismaData, statsData);

    expect(createdPokemon).toBeInstanceOf(Pokemon);
    expect(createdPokemon.getId()).toBe(pokemonPrismaData.id);
    expect(createdPokemon.getName()).toBe(pokemonPrismaData.name);
    expect(createdPokemon.getType()).toBe(pokemonPrismaData.type);
    expect(createdPokemon.getHealth()).toBe(pokemonPrismaData.health);
    expect(createdPokemon.getCanEvolve()).toBe(pokemonPrismaData.canEvolve);
  });

});
