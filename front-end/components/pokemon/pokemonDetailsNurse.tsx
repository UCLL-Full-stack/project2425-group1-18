import React, { useState } from 'react';
import { Pokemon, Trainer } from '@types';
import nurseService from '../../services/nurse.service';  // Import the nurse service
import trainerService from '../../services/trainer.service'; // Import the trainer service
import styles from '../../styles/pokemon.module.css';

interface PokemonDetailsProps {
  pokemon: Pokemon;
  nurseId: number;
  reload: (boolean:boolean) => void;
  update: boolean;
  clearSelected: (pokemon:Pokemon | null)=>void;
}

const PokemonDetails: React.FC<PokemonDetailsProps> = ({
  pokemon,
  nurseId,
  reload,
  update,
  clearSelected
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // The function to heal the Pokémon
  const handleHeal = async () => {
    if (pokemon.id === undefined) {
      alert('Pokémon ID is missing. Cannot heal the Pokémon.');
      return;
    }

    try {
      // Call the healPokemon method from nurseService
      const response = await nurseService.healPokemon(nurseId, pokemon.id);
      alert(`${pokemon.name} has been healed successfully.`);
      reload(!update);
      clearSelected(null);
      // You can update the state or UI with the healed pokemon here
    } catch (error: any) {
      alert(error.message || 'Failed to heal Pokémon.');
    }
  };

  // The function to send the Pokémon back to the trainer
  const handleSendBack = async () => {
    if (pokemon.id === undefined) {
      alert('Pokémon ID is missing. Cannot send back.');
      return;
    }
  
    setIsLoading(true); // Set loading state to true
  
    try {
      // Call the addPokemonToTrainer function to send the Pokémon back to the trainer
      const updatedTrainer = await nurseService.addPokemonToTrainer(pokemon.id);
      alert(`${pokemon.name} has been sent back to the trainer!`);
      console.log('Updated Trainer:', updatedTrainer);
  
      // Wait for 2 seconds before calling the removePokemonFromNurse function
      setTimeout(async () => {
        if (pokemon.id !== undefined) {  // Ensure the id is still valid
          try {
            // Call removePokemonFromNurse method after 2 seconds
            await nurseService.removePokemonFromNurse(pokemon.id);
            alert(`${pokemon.name} has been removed from nurse's care.`);
            reload(!update);
            clearSelected(null);
          } catch (error: any) {
            alert(error.message || 'Failed to remove Pokémon from nurse.');
          }
        } else {
          alert('Pokémon ID is invalid. Cannot remove from nurse.');
        }
      }, 2000); // 2 seconds delay
  
    } catch (error: any) {
      alert(error.message || 'Failed to send Pokémon back to trainer.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  return (
    <div className={styles.card}>
      <h3>Details for {pokemon.name}</h3>
      <p>Type: {pokemon.type}</p>
      <div className={styles.healthContainer}>
        <p>
          Health: {pokemon.health} / {pokemon.stats.hp}
        </p>
      </div>
      <ul>
        <li>Max HP: {pokemon.stats.hp}</li>
      </ul>

      {/* Display the heal button if health is less than max HP */}
      {pokemon.health < pokemon.stats.hp && (
        <button className={styles.healButton} onClick={handleHeal} disabled={isLoading}>
          {isLoading ? 'Healing...' : 'Heal'}
        </button>
      )}

      {/* Display the send back button if health is equal to max HP */}
      {pokemon.health === pokemon.stats.hp && (
        <button className={styles.healButton} onClick={handleSendBack} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Back to Trainer'}
        </button>
      )}
    </div>
  );
};

export default PokemonDetails;
