
import React from 'react';
import { Pokemon, Trainer } from '@types';
import { useTranslation } from 'react-i18next';

interface PokemonOverviewTableProps {
  pokemon: Pokemon[];
  selectPokemon: (pokemon: Pokemon) => void;
  setSelectTrainer?: (trainer: Trainer) => void;
  trainer?: Trainer
}

const PokemonOverviewTable: React.FC<PokemonOverviewTableProps> = ({ pokemon, selectPokemon, setSelectTrainer, trainer   }) => {

  const { t } = useTranslation();

  const onClick = (pokemon:Pokemon) => {
    selectPokemon(pokemon)
    if (trainer && setSelectTrainer) {
      setSelectTrainer(trainer)
    }
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>{t("pokemon.name")}</th>
          <th>{t("pokemon.type")}</th>
        </tr>
      </thead>
      <tbody>
        {pokemon.map((p) => (
          <tr key={p.id} onClick={() => onClick(p)}>
            <td>{p.name}</td>
            <td>{p.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PokemonOverviewTable;
