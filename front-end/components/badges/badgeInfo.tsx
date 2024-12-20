import React from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Badge } from '@types';
import BadgeImage from './badgeImage';
import { useTranslation } from 'next-i18next';

interface BadgeInfoProps {
  badge: Badge
  owned: boolean
  handleAddBadge: (badge:Badge)=>void
}

const BadgeInfo: React.FC<BadgeInfoProps> = ({badge, owned, handleAddBadge}) => {

    const { t } = useTranslation();

    return (
        <div className="flex flex-colom flex-wrap justify-start items-center gap-4"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}>
            <BadgeImage
            badgeName={badge.name}
            owned={true}/>
            <p>{badge.name}</p>
            <p>{t('badge.location')} {badge.location}</p>
            <p>{t('badge.difficulty')} {badge.difficulty}/5</p>
            {!owned && badge && (
                <button onClick={()=>handleAddBadge(badge)}>
                    {t('badge.get')}
                </button>)}
            {owned && (
                <p>{t("badge.congrats")}</p>
            )}
        </div>)
}

export default BadgeInfo
