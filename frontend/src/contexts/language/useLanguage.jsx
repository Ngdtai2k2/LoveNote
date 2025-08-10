import { useContext } from 'react';

import { LanguageContext } from '../createContext';

const useLanguage = () => useContext(LanguageContext);

export default useLanguage;
