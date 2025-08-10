import ROUTES from '@constants/routes';
import {
  signInError,
  signInStart,
  signInSuccess,
  signOutError,
  signOutStart,
  signOutSuccess,
} from '@redux/slice/auth';
import API_ENDPOINTS from '@utils/api';
import axiosClient from '@utils/axiosClient';
import { toast } from 'react-fox-toast';

export const authAPI = {
  signUp: async (data, navigate) => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.AUTH.SIGN_UP, {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      toast.success(response.data.message, {
        position: 'top-right',
      });
      navigate(ROUTES.AUTH.SIGN_IN);
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  signIn: (data, navigate) => async (dispatch) => {
    dispatch(signInStart());

    try {
      const response = await axiosClient.post(API_ENDPOINTS.AUTH.SIGN_IN, {
        email: data.email,
        password: data.password,
      });
      toast.success(response.data.message, {
        position: 'top-right',
      });
      dispatch(signInSuccess(response.data));
      navigate(ROUTES.HOME);
      window.location.reload();
    } catch (error) {
      dispatch(signInError(error.response?.data));
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  signOut: (axiosJWT, navigate) => async (dispatch) => {
    dispatch(signOutStart());
    try {
      const response = await axiosJWT.post(API_ENDPOINTS.AUTH.SIGN_OUT);
      dispatch(signOutSuccess());
      toast.success(response.data.message, {
        position: 'top-right',
      });
      navigate(ROUTES.HOME);
      window.location.reload();
    } catch (error) {
      dispatch(signOutError());
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  changePassword: async (axiosJWT, userId, data) => {
    try {
      const response = await axiosJWT.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD(userId), {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(response?.data.message, {
        position: 'top-right',
      });
      return response;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, email);
      toast.success(response?.data.message, {
        position: 'top-right',
      });
      return response;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  verifyCode: async (code) => {
    const email = sessionStorage.getItem('email');
    try {
      const response = await axiosClient.post(API_ENDPOINTS.AUTH.VERIFY_CODE, {
        code: code,
        email: email,
      });
      toast.success(response?.data.message, {
        position: 'top-right',
      });
      return response;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },

  resetPassword: async (newPassword) => {
    const email = sessionStorage.getItem('email');
    const code = sessionStorage.getItem('verify_code');

    try {
      const response = await axiosClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        code: code,
        email: email,
        newPassword: newPassword,
      });
      toast.success(response?.data.message, {
        position: 'top-right',
      });
      return response;
    } catch (error) {
      toast.error(error.response?.data.message, {
        position: 'top-right',
      });
    }
  },
};
