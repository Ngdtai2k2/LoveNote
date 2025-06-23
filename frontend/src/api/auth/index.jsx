import axios from 'axios';
import { toast } from 'react-fox-toast';
import API_ENDPOINTS from '@utils/api';
import ROUTES from '@constants/routes';
import {
  signInError,
  signInStart,
  signInSuccess,
  signOutStart,
  signOutSuccess,
  signOutError,
} from '@redux/slice/auth';

export const signUp = async (data, navigate) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.AUTH.SIGN_UP,
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      },
      {
        withCredentials: true,
        headers: {
          'Accept-Language': 'vi',
        },
      }
    );
    toast.success(response.data.message, {
      position: 'bottom-right',
    });
    navigate(ROUTES.AUTH.SIGN_IN);
  } catch (error) {
    toast.error(error.response?.data.message, {
      position: 'bottom-right',
    });
  }
};

export const signIn = (data, navigate) => async (dispatch) => {
  dispatch(signInStart());

  try {
    const response = await axios.post(
      API_ENDPOINTS.AUTH.SIGN_IN,
      { email: data.email, password: data.password },
      {
        withCredentials: true,
        headers: {
          'Accept-Language': 'vi',
        },
      }
    );
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
};

export const signOut = (axiosJWT, navigate) => async (dispatch) => {
  dispatch(signOutStart());
  try {
    const response = await axiosJWT.post(API_ENDPOINTS.AUTH.SIGN_OUT, {
      withCredentials: true,
      headers: {
        'Accept-Language': 'vi',
      },
    });
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
};
