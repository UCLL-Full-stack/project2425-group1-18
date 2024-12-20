import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonDetails from '@components/pokemon/pokemonDetails'; // Adjust path as necessary
import { Pokemon } from '@types'; // Adjust path as necessary
import TrainerService from '@services/trainer.service'; // Adjust path as necessary
import { useTranslation } from 'next-i18next';

// Mocking next-i18next and TrainerService
jest.mock('next-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({ t: (key: string) => key }),
}));

jest.mock('@services/trainer.service', () => ({
  transferPokemonToNurse: jest.fn(),
}));

beforeAll(() => {
    global.alert = jest.fn(); // Mock alert
  });
  
  afterAll(() => {
    jest.restoreAllMocks(); // Cleanup mocks
  });

describe('PokemonDetails Component', () => {
  const mockPokemon: Pokemon = {
    id: 1,
    name: 'Pikachu',
    type: 'Electric',
    health: 50,
    stats: {
      hp: 100,
      attack: 55,
      defence: 40,
      specialAttack: 50,
      specialDefence: 50,
      speed: 90,
    },
    canEvolve: false,
  };

  const mockReload = jest.fn();
  const mockClearSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Pokémon details correctly', () => {
    render(
      <PokemonDetails
        pokemon={mockPokemon}
        nurseId={123}
        reload={mockReload}
        update={false}
        clearSelected={mockClearSelected}
      />
    );

    expect(screen.getByText('pokemon.details Pikachu')).toBeInTheDocument();
    expect(screen.getByText('pokemon.type: Electric')).toBeInTheDocument();
    expect(screen.getByText('pokemon.health 50 / 100')).toBeInTheDocument();
    expect(screen.getByText('pokemon.stats')).toBeInTheDocument();
    expect(screen.getByText('pokemon.hp 100')).toBeInTheDocument();
    expect(screen.getByText('pokemon.attack 55')).toBeInTheDocument();
    expect(screen.getByText('pokemon.defence 40')).toBeInTheDocument();
  });

  test('displays the "Send to Hospital" button when health is less than max HP', () => {
    render(
      <PokemonDetails
        pokemon={mockPokemon}
        nurseId={123}
        reload={mockReload}
        update={false}
        clearSelected={mockClearSelected}
      />
    );

    const button = screen.getByRole('button', { name: 'pokemon.send-to-hospital' });
    expect(button).toBeInTheDocument();
  });

  test('does not display the "Send to Hospital" button when health equals max HP', () => {
    render(
      <PokemonDetails
        pokemon={{ ...mockPokemon, health: 100 }} // Set health to max HP
        nurseId={123}
        reload={mockReload}
        update={false}
        clearSelected={mockClearSelected}
      />
    );

    const button = screen.queryByRole('button', { name: 'pokemon.send-to-hospital' });
    expect(button).not.toBeInTheDocument();
  });


  test('displays an alert when Pokémon ID is missing', () => {
    window.alert = jest.fn();

    render(
      <PokemonDetails
        pokemon={{ ...mockPokemon, id: undefined }} // Remove Pokémon ID
        nurseId={123}
        reload={mockReload}
        update={false}
        clearSelected={mockClearSelected}
      />
    );

    const button = screen.getByRole('button', { name: 'pokemon.send-to-hospital' });

    fireEvent.click(button);

    expect(window.alert).toHaveBeenCalledWith(
      'Pokémon ID is missing. Cannot send to hospital.'
    );
  });
});
