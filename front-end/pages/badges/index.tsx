import React, { useEffect, useState } from 'react';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import { serverSideTranslations } from 'next-i18next/serversideTranslations';
import { useTranslation } from 'next-i18next';
import { Badge, Trainer } from '@types';
import TrainerService from '@services/trainer.service';
import BadgeDisplay from '@components/badges/badgeDisplay';
import Head from 'next/head';

const Badges: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [loggedInEmail, setLoggedInEmail] = useState<string>('');
  const [role, setRole] = useState<string>('guest');

  const { t } = useTranslation();

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
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const getTrainers = async () => {
    try {
      const allTrainers = await TrainerService.getAllTrainers();
      
      // Filter trainers by the logged-in user's email if the role is "trainer"
      const filteredTrainers =
        role === 'trainer'
          ? allTrainers.filter((trainer) => trainer.user.email === loggedInEmail)
          : allTrainers; // Admin sees all trainers

      setTrainers(filteredTrainers);

      // If we found a matching trainer, set them as the selected trainer (for non-admins)
      if (filteredTrainers.length > 0 && role === 'trainer') {
        setSelectedTrainer(filteredTrainers[0]); // Only set the first matching trainer
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Get trainer by email (for logged-in trainer only)
  const getTrainerByEmail = async (email: string) => {
    try {
      const trainer = await TrainerService.getTrainerByEmail(email);
      console.log(trainer);
      setTrainers([trainer]);
      setSelectedTrainer(trainer);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Only run the getTrainers function when loggedInEmail is available
    if (loggedInEmail) {
      if (role === 'trainer') {
        getTrainerByEmail(loggedInEmail);
      } else if (role === 'admin') {
        getTrainers(); // Admin sees all trainers
      }
    }
  }, [loggedInEmail, role]);

  return (
    <>
      <Head>
        <title>{t('app.title')}</title>
      </Head>
      <Header />
      <main>
        <h1>{t('badge.title')}</h1>

        {trainers.length === 0 ? (
          <p>{t('badge.noTrainFound')}</p>
        ) : (
          <>
            {role === 'admin' && (
              <>
                <h2>{t('badge.allTrainersBadges')}</h2>
                {trainers.map((trainer) => (
                  <div key={trainer.id}>
                    <h3>{trainer.user.firstName}'s badges:</h3>
                    <BadgeDisplay badges={trainer.badges} />
                  </div>
                ))}
              </>
            )}

            {role === 'trainer' && selectedTrainer && (
              <>
                <h2>{selectedTrainer.user.firstName}'s badges:</h2>
                <BadgeDisplay badges={selectedTrainer.badges} />
              </>
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

export default Badges;
