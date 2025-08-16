import { useEffect, useState } from 'react';

import { productAPI } from '@api/public/product';

export const useProductBySlug = () => {
  const [product, setProduct] = useState();

  useEffect(() => {
    const fetch = async () => {
      const path = window.location.pathname;
      const slug = path.startsWith('/') ? path.slice(1) : path;
      const response = await productAPI.getProductBySlug(slug);
      if (response?.status === 200) setProduct(response.data);
    };
    fetch();
  }, []);

  return product;
};
