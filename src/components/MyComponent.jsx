import React from 'react';
import PageTitle from './PageTitle';
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
        <PageTitle title={t('hometitle')} />
    </div>
  );
};

export default MyComponent;