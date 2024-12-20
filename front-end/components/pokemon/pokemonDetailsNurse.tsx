import React, { useState } from 'react';
import { Pokemon, Trainer } from '@types';
import nurseService from '../../services/nurse.service';  // Import the nurse service
import trainerService from '../../services/trainer.service'; // Import the trainer service
import styles from '../../styles/pokemon.module.css';
import { useTranslation } from 'next-i18next';


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
  const { t } = useTranslation();
  


  const handleHeal = async () => {
    if (pokemon.id === undefined) {
      alert('Pokémon ID is missing. Cannot heal the Pokémon.');
      return;
    }

    try {

      const response = await nurseService.healPokemon(nurseId, pokemon.id);
      alert(`${pokemon.name} ${t("pokemon.heal-success")}`);
      reload(!update);
      clearSelected(null);
    } catch (error: any) {
      alert(error.message || 'Failed to heal Pokémon.');
    }
  };


  const handleSendBack = async () => {
    if (pokemon.id === undefined) {
      alert('Pokémon ID is missing. Cannot send back.');
      return;
    }
  
    setIsLoading(true); 
  
    try {
      // Call the addPokemonToTrainer function to send the Pokémon back to the trainer
      const updatedTrainer = await nurseService.addPokemonToTrainer(pokemon.id);
      alert(`${pokemon.name} ${t("pokemon.send-back-success")}`);
      console.log('Updated Trainer:', updatedTrainer);
  

      setTimeout(async () => {
        if (pokemon.id !== undefined) {
          try {

            await nurseService.removePokemonFromNurse(pokemon.id);
            alert(`${pokemon.name} ${t("pokemon.removed-from-care")}`);
            reload(!update);
            clearSelected(null);
          } catch (error: any) {
            alert(error.message || 'Failed to remove Pokémon from nurse.');
          }
        } else {
          alert('Pokémon ID is invalid. Cannot remove from nurse.');
        }
      }, 2000); 
  
    } catch (error: any) {
      alert(error.message || 'Failed to send Pokémon back to trainer.');
    } finally {
      setIsLoading(false); 
    }
  };
  return (
    <div className={styles.card}>
      <h3>{t("pokemon.details")} {pokemon.name}</h3>
      <p>{t("pokemon.type")}: {pokemon.type}</p>
      <div className={styles.healthContainer}>
        <p>
        {t("pokemon.health")} {pokemon.health} / {pokemon.stats.hp}
        </p>
      </div>
      <ul>
        <li>{t("pokemon.hp")} {pokemon.stats.hp}</li>
      </ul>

      {}
      {pokemon.health < pokemon.stats.hp && (
        <button className={styles.healButton} onClick={handleHeal} disabled={isLoading}>
          {isLoading ? 'Healing...' : t("pokemon.heal")}
        </button>
      )}

      {}
      {pokemon.health === pokemon.stats.hp && (
        <button className={styles.healButton} onClick={handleSendBack} disabled={isLoading}>
          {isLoading ? 'Sending...' : t("pokemon.send-back")}
        </button>
      )}
    </div>
  );
};

export default PokemonDetails;
