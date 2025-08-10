import { useContext } from 'react';

import { ModeContext } from '../createContext';

export const useInterfaceMode = () => useContext(ModeContext);
