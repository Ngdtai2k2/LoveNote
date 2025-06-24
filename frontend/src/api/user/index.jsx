import API_ENDPOINTS from '@utils/api';
import { removeUser, setUser } from '@redux/slice/user';
import { signOutSuccess } from '@redux/slice/auth';
import { toast } from 'react-fox-toast';

export const userAPI = {
  getCurrentUser: async (dispatch, axiosJWT) => {
    try {
      const res = await axiosJWT.get(API_ENDPOINTS.AUTH.ME);
      dispatch(setUser(res.data.user));
    } catch {
      dispatch(removeUser());
      dispatch(signOutSuccess());
    }
  },
  updateProfile: async (userId, data, axiosJWT) => {
    try {
      const res = await axiosJWT.put(API_ENDPOINTS.USER.UPDATE(userId), data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(res.data.message, {
        position: 'top-right',
      });
      return res;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },
};
