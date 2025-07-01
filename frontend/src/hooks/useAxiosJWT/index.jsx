import axios from 'axios';
import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';

import { signInSuccess } from '@redux/slice/auth';
import API_ENDPOINTS from '@utils/api';
import axiosClient from '@utils/axiosClient';

const refreshToken = async () => {
  try {
    const res = await axiosClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

let refreshTokenPromise = null;

export const createAxios = (lng, auth, dispatch, stateSuccess) => {
  const newInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
      'Accept-Language': lng,
      Authorization: auth ? `Bearer ${auth.token}` : '',
    },
  });

  newInstance.interceptors.request.use(
    async (config) => {
      const decodedToken = jwtDecode(auth?.token);
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = currentTime > decodedToken.exp;

      if (isExpired) {
        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshToken();
        }

        const data = await refreshTokenPromise;
        refreshTokenPromise = null;

        if (data.token) {
          const refreshUser = {
            ...auth,
            token: data.token,
          };
          if (stateSuccess) {
            dispatch(stateSuccess(refreshUser));
          } else {
            dispatch(signInSuccess(refreshUser));
          }
          config.headers['Authorization'] = `Bearer ${data.token}`;
        } else {
          if (stateSuccess) {
            dispatch(stateSuccess(null));
          }
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return newInstance;
};

export const useAxios = (lng, stateSuccess) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const axiosJWT = useMemo(() => {
    if (auth) {
      return createAxios(lng, auth, dispatch, stateSuccess);
    }
    return axios;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.token, lng, stateSuccess]);

  return { auth, accessToken: auth?.token, axiosJWT };
};
