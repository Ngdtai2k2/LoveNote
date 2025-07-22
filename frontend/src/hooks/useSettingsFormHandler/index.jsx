import { useState } from 'react';

export const useSettingsFormHandler = ({
  user,
  product,
  navigate,
  axiosJWT,
  handleSubmitSettings,
  transformValues,
}) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sitePath, setSitePath] = useState('');
  const [payload, setPayload] = useState({});

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const cleanedValues = transformValues ? transformValues(values) : values;

      const res = await handleSubmitSettings(cleanedValues, user, axiosJWT, navigate);
      if (res?.data) {
        const path = res.data.slug;
        setSitePath(path);
        setModalOpen(true);
        setPayload({
          description: `${user.id}-${product?.id}`,
          transactionId: res.data.transaction_id,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    onSubmit,
    loading,
    modalOpen,
    setModalOpen,
    sitePath,
    payload,
  };
};
