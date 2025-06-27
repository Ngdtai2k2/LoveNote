import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import NotFound from '@pages/NotFound';
import { userSiteAPI } from '@api/userSite';
import TEMPLATE_ROUTE from '@constants/routes/template';

export default function UserTemplateRouter() {
  const { slug } = useParams();
  const [configs, setConfigs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const getSiteConfig = async () => {
      try {
        setLoading(true);
        const res = await userSiteAPI.getSiteConfig({ slug: slug });
        setConfigs(res);
      } catch {
        setLoading(false);
        setNotFound(true);
      } finally {
        setLoading(false);
        setNotFound(false);
      }
    };

    getSiteConfig();
  }, [slug]);

  if (loading)
    return (
      <div className="mt-2 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
      </div>
    );

  if (notFound || !configs) return <NotFound />;

  const slugTemplate = configs?.product?.slug;

  const SelectedTemplate = TEMPLATE_ROUTE[slugTemplate];

  if (SelectedTemplate) {
    return <SelectedTemplate data={configs} />;
  }

  return <NotFound />;
}
