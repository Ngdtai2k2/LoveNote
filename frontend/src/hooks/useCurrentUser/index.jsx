import { useSelector } from 'react-redux';

export const useCurrentUser = () => {
  const user = useSelector(state => state?.user);

  return user;
};
