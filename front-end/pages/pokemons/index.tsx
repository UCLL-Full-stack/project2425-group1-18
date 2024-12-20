import React, { useEffect, useState } from 'react';
import Header from '@components/header';
import PokemonOverviewTable from '@components/pokemon/pokemonOverviewTable';
import TrainerService from '@services/trainer.service';
import nurseService from '@services/nurse.service';
import { Nurse, Pokemon, Trainer } from '@types';
import PokemonDetails from '@components/pokemon/pokemonDetails';
import AddPokemonModal from '@components/pokemon/addPokemonModal';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serversideTranslations';
import PokemonDetailsNurse from '@components/pokemon/pokemonDetailsNurse';
import Head from 'next/head';

const Pokemons: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState<string>('');
  const [role, setRole] = useState<string>('guest');
  const [update, setUpdate] = useState<boolean>(true);

  const { t } = useTranslation();

  const clearSelected = (pokemon: Pokemon | null) => {
    setSelectedPokemon(pokemon);
    if (role == "admin") {
      setSelectedTrainer(null)
    }
  };

  // Check if the code is running in the browser and then access localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedInUser = localStorage.getItem('loggedInUser');
      let email = '';
      if (loggedInUser) {
        const parsedUser = JSON.parse(loggedInUser);
        email = parsedUser.email;
        setRole(parsedUser.role);
      }
      setLoggedInEmail(email);
    }
  }, []);

  const getAllTrainers = async () => {
    const trainer = await TrainerService.getAllTrainers();
    setTrainers(trainer);
  };

  const getAllNurses = async () => {
    const nurse = await nurseService.getAllNurses();
    setNurses(nurse);
  };

  const getTrainerByEmail = async (email: string) => {
    try {
      const trainer = await TrainerService.getTrainerByEmail(email);
      setTrainers([trainer]);
      setSelectedTrainer(trainer);
    } catch (error) {
      console.error(error);
    }
  };

  const getNurseByEmail = async (email: string) => {
    try {
      const nurse = await nurseService.getNurseByEmail(email);
      setNurses([nurse]);
      setSelectedNurse(nurse);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loggedInEmail && role) {
      if (role === 'trainer') {
        getTrainerByEmail(loggedInEmail);
      } else if (role === 'nurse') {
        getNurseByEmail(loggedInEmail);
      } else if (role === 'admin') {
        getAllNurses();
        getAllTrainers();
      }
    }
  }, [loggedInEmail, role, update]);

  const handleSelectPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleAddPokemon = async (newPokemon: Pokemon) => {
    try {
      if (selectedTrainer && selectedTrainer.id) {
        const updatedTrainer = await TrainerService.addPokemonToTrainerById(
          selectedTrainer.id,
          newPokemon
        );
        setSelectedTrainer(updatedTrainer);
        setTrainers((prevTrainers) =>
          prevTrainers.map((trainer) =>
            trainer.id === updatedTrainer.id ? updatedTrainer : trainer
          )
        );
      } 
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAdmin = (trainer: Trainer | Nurse) => {
    if ('pokemon' in trainer) {
      setSelectedTrainer(trainer as Trainer);
    } else {
      setSelectedNurse(trainer as Nurse);
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>{t("app.title")}</title>
      </Head>
      <Header />
      <main>
        <h1>{t('pokemon.pokemon')}</h1>

        {/* Trainer View */}
        {role === 'trainer' && trainers.length === 0 ? (
          <p>No trainers found for the logged-in email.</p>
        ) : (
          role === 'trainer' && selectedTrainer && (
            <>
              <h2>
                {selectedTrainer.user.firstName}
                {t('pokemon.users-pokemon')}
              </h2>
              <button onClick={() => setIsModalOpen(true)}>
                {t('pokemon.add')}
              </button>
              {selectedTrainer && isModalOpen && (
                <AddPokemonModal
                  onClose={() => setIsModalOpen(false)}
                  onAddPokemon={handleAddPokemon}
                />
              )}
              <PokemonOverviewTable
                pokemon={selectedTrainer.pokemon}
                selectPokemon={handleSelectPokemon}
              />
              {selectedPokemon && (
                <PokemonDetails
                  pokemon={selectedPokemon}
                  nurseId={1}
                  reload={setUpdate}
                  update={update}
                  clearSelected={clearSelected}
                />
              )}
            </>
          )
        )}

        {/* Nurse View */}
        {role === 'nurse' && nurses.length === 0 ? (
          <p>No nurse found for the logged-in email.</p>
        ) : (
          role === 'nurse' && selectedNurse && (
            <>
              <h2>
                {selectedNurse.user.firstName}
                {t('pokemon.nurse-pokemon')}
              </h2>
              <PokemonOverviewTable
                pokemon={selectedNurse.pokemon}
                selectPokemon={handleSelectPokemon}
              />
              {selectedPokemon && (
                <PokemonDetailsNurse
                  pokemon={selectedPokemon}
                  nurseId={1}
                  reload={setUpdate}
                  update={update}
                  clearSelected={clearSelected}
                />
              )}
            </>
          )
        )}

        {/* Admin View */}
        {role === 'admin' && (
  <>
    <h2>{t('trainers')}</h2>
    {trainers.map((trainer) => (
      <div key={trainer.id}>
        <h3>{trainer.user.firstName}</h3>
        <button
          onClick={() => handleAddAdmin(trainer)} 
          style={{ marginBottom: '1em' }}
        >
          {t('pokemon.add')}
        </button>
        <PokemonOverviewTable
          pokemon={trainer.pokemon}
          selectPokemon={handleSelectPokemon}
          setSelectTrainer={setSelectedTrainer}
          trainer={trainer}
        />
        {selectedPokemon && selectedTrainer?.id === trainer.id && (
          <PokemonDetails
            pokemon={selectedPokemon}
            nurseId={1}
            reload={setUpdate}
            update={update}
            clearSelected={clearSelected}
          />
        )}
      </div>
    ))}
    <h2>{t('nurses')}</h2>
    {nurses.map((nurse) => (
      <div key={nurse.id}>
        <h3>{nurse.user.firstName}</h3>
        <PokemonOverviewTable
          pokemon={nurse.pokemon}
          selectPokemon={handleSelectPokemon}
        />
        {selectedPokemon && selectedNurse?.id === nurse.id && (
          <PokemonDetailsNurse
            pokemon={selectedPokemon}
            nurseId={1}
            reload={setUpdate}
            update={update}
            clearSelected={clearSelected}
          />
        )}
      </div>
    ))}
    {selectedTrainer && isModalOpen && (
      <AddPokemonModal
        onClose={() => setIsModalOpen(false)}
        onAddPokemon={handleAddPokemon}
      />
    )}
    {selectedPokemon && (
      <PokemonDetailsNurse
        pokemon={selectedPokemon}
        nurseId={1}
        reload={setUpdate}
        update={update}
        clearSelected={clearSelected}
      />
    )}
  </>
)}
      </main>
    </>
  );
};

export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default Pokemons;
