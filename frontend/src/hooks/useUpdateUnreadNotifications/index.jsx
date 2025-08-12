import { setUser } from '@redux/slice/user';
import { useDispatch, useSelector } from 'react-redux';

export const useUpdateUnreadNotifications = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);

  const decrementUnread = () => {
    dispatch(
      setUser({
        ...user,
        unread_notifications: Math.max((user.unread_notifications || 0) - 1, 0),
      })
    );
  };

  const resetUnread = () => {
    dispatch(
      setUser({
        ...user,
        unread_notifications: 0,
      })
    );
  };

  return { decrementUnread, resetUnread };
};
