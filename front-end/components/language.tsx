import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

const Language: React.FC = () => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

    const { t } = useTranslation();

  const handleLanguageChange = (event: { target: { value: string } }) => {
    const newLocale = event.target.value;
    const {pathname, asPath, query} = router;
    router.push({pathname,query}, asPath, {locale:newLocale})
   };

  return (
    <div className="ml-6">
      <label className="text-white">
        {t("header.language")}
      </label>
      <select
        id="language"
        className="ml-2 p-1"
        value={locale}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="nl">Nederlands</option>

      </select>
    </div>
  );
};


export default Language;
