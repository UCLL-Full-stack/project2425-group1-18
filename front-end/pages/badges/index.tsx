import React, { useEffect, useState } from 'react';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import { serverSideTranslations } from 'next-i18next/serversideTranslations';
import { useTranslation } from 'next-i18next';
import { Badge, Trainer } from '@types';
import TrainerService from '@services/trainer.service';
import BadgeDisplay from '@components/badges/badgeDisplay';
import Head from 'next/head';


const badges: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState<string>('');
  const [role, setRole] = useState<string>("guest")

  const { t } = useTranslation();

  // Check if the code is running in the browser and then access localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedInUser = localStorage.getItem('loggedInUser');
      let email = ''
      if (loggedInUser) {
        const parsedUser = JSON.parse(loggedInUser)
        email = parsedUser.email
        setRole(parsedUser.role)
      } 
      setLoggedInEmail(email);
    }
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  const getTrainers = async () => {
    try {
      const allTrainers = await TrainerService.getAllTrainers();

      // Filter trainers by the logged-in user's email
      const filteredTrainers = allTrainers.filter((trainer) => trainer.user.email === loggedInEmail);

      setTrainers(filteredTrainers);

      // If we found a matching trainer, set them as the selected trainer
      if (filteredTrainers.length > 0) {
        setSelectedTrainer(filteredTrainers[0]); // Only set the first matching trainer
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTrainerByEmail = async(email:string) =>{
    try {
      const trainer = await TrainerService.getTrainerByEmail(email);
      console.log(trainer)

      setTrainers([trainer]);
      setSelectedTrainer(trainer)
      }
     catch (error) {
      console.error(error);
    }
  };

    useEffect(() => {
      // Only run the getTrainers function when loggedInEmail is available
      if (loggedInEmail) {
        if (role== "trainer") {
          getTrainerByEmail(loggedInEmail)
        }
      }
    }, [loggedInEmail]);

  return (
    <>
        <Head>
            <title>{t("app.title")}</title>
        </Head>
      <Header />
      <main>
      <h1>Badge</h1>
        {trainers.length === 0 ? (
          <p>No trainers found for the logged-in email.</p>
        ) : (
          <>
            {selectedTrainer && (
              <>
                <h2>{selectedTrainer.user.firstName}'s badges:</h2>
                <BadgeDisplay
                badges={selectedTrainer.badges}
                 />
              </>
            )}
          </>
        )}
      </main>
    </>
  );
};

export const getServerSideProps = async (context: { locale: any; }) => {
  const {locale} = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common"]))
      },
  };
};

export default badges;