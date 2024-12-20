import Header from "@components/header";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serversideTranslations';
import { useEffect, useState } from "react";
import { Badge, Trainer } from "@types";
import TrainerService from "@services/trainer.service";
import BadgeInfo from "@components/badges/badgeInfo";
import Head from 'next/head';

const namedBadge: React.FC = () => {
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
    const [badge, setBadge] = useState<Badge>({name:"Boulder badge", difficulty:1, location: "Pewter City"})
    const [ownedBool, setOwnedBool] = useState<boolean>(false)
    const router = useRouter();
    const { badgeName, owned} = router.query;

    const allBadges = [
        {name:"Boulder badge", difficulty:1, location: "Pewter City"},
        {name:"Cascade badge", difficulty:1, location: "Cerulean City"},
        {name:"Thunder badge", difficulty:2, location: "Vermilion City"},
        {name:"Rainbow badge", difficulty:2, location: "Celadon City"},
        {name:"Soul badge", difficulty:3, location: "Fuchsia City"},
        {name:"Marsh badge", difficulty:4, location: "Saffron City"},
        {name:"Volcano badge", difficulty:5, location: "Seafoam Islands"},
        {name:"Earth badge", difficulty:5, location: "Viridian City"},
    ]

    const getTrainerByEmail = async (email: string) => {
        try {
            const trainer = await TrainerService.getTrainerByEmail(email);
            setSelectedTrainer(trainer);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            getTrainerByEmail(JSON.parse(loggedInUser).email);
          }
        const allBadgesFilterd = allBadges.filter((badgeToFilter)=>badgeToFilter.name==badgeName);
        setBadge(allBadgesFilterd[0])
        if (owned === "true") {
            setOwnedBool(true)
        } else {
            setOwnedBool(false)
        }
    }, []);

    const { t } = useTranslation();

    const handleAddBadge = async (newBadge: Badge) => {
        try {
          if (selectedTrainer && selectedTrainer.id) {
            console.log("if")
            const updatedTrainer = await TrainerService.addBadgeToTrainerById(
              selectedTrainer.id,
              newBadge
            );
            setOwnedBool(true);
            router.push('/badges/' + badgeName +'/true')
        }
        } catch (error) {
          console.error(error);
        }
      };
    

    return(
    <>
        <Head>
            <title>{t("app.title")}</title>
        </Head>
        <Header/>
        <main>
            <BadgeInfo
                badge={badge}
                owned={ownedBool}
                handleAddBadge={handleAddBadge}
            />
        </main>
    </>
)
}

export const getServerSideProps = async (context: { locale: any; }) => {
  const {locale} = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common"]))
      },
  };
};

export default namedBadge;