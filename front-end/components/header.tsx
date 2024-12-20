import Link from 'next/link';
import Language from './language';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState<string>('guest'); // Default role is 'guest'
  const router = useRouter();

  // Fetch the logged-in user's role from localStorage or another state management method
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (loggedInUser) {
        const parsedUser = JSON.parse(loggedInUser);
        setRole(parsedUser.role); // Set the role from the stored user data
      }
    }
  }, []);

  const logOut = () => {
    localStorage.clear();
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }

  return (
    <header className="p-3 mb-3 border-bottom bg-dark bg-gradient">
      <a className="fs-2 d-flex justify-content-center mb-2 mb-lg-0 text-white-50 text-decoration-none">
        {t('app.title')}
      </a>
      <nav className="nav justify-content-center">
        {role === "guest" && (
          <Link href="/login" className="nav-link px-4 fs-5 text-white">
            {t('header.login')}
          </Link>
        )}

        {}
        {role === 'trainer' && (
          <>
            <Link href="/pokemons" className="nav-link px-4 fs-5 text-white">
              {t('header.pokemon')}
            </Link>
            <Link href="/badges" className="nav-link px-4 fs-5 text-white">
              {t('header.badges')}
            </Link>
            <button onClick={logOut} type='submit'>
              {t("header.logout")}
            </button>
          </>
        )}

        {}
        {role === 'nurse' && (
          <>
            <Link href="/pokemons" className="nav-link px-4 fs-5 text-white">
              {t('header.pokemon')}
            </Link>
            <button onClick={logOut} type='submit'>
              {t("header.logout")}
            </button>
          </>
        )}

        {role === 'admin' && (
          <>
            <Link href="/pokemons" className="nav-link px-4 fs-5 text-white">
              {t('header.pokemon')}
            </Link>
            <Link href="/badges" className="nav-link px-4 fs-5 text-white">
              {t('header.badges')}
            </Link>
            <button onClick={logOut} type='submit'>
              {t("header.logout")}
            </button>
          </>
        )}

        {}
        <Language />
      </nav>
    </header>
  );
};

export default Header;
