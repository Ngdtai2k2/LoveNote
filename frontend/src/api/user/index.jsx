import API_ENDPOINTS from '@utils/api';
import { removeUser, setUser } from '@redux/slice/user';
import { signOutSuccess } from '@redux/slice/auth';

export const getCurrentUser = async (dispatch, axiosJWT) => {
  try {
    const res = await axiosJWT.get(API_ENDPOINTS.AUTH.ME);
    dispatch(setUser(res.data.user));
  } catch (error) {
    dispatch(removeUser());
    dispatch(signOutSuccess());
  }
};
