import API_ENDPOINTS from '@constants/api';
import { removeUser, setUser } from '@redux/slice/user';

export const getCurrentUser = async (dispatch, axiosJWT) => {
  try {
    const res = await axiosJWT.get(API_ENDPOINTS.AUTH.ME);
    dispatch(setUser(res.data.user));
  } catch (error) {
    dispatch(removeUser());
  }
};
