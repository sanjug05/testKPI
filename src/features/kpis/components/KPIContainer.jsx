import React from 'react';
import CollapsibleCard from '../../../components/shared/ui/CollapsibleCard';

const KPIContainer = ({ title, description, toolbar, children }) => (
  <CollapsibleCard title={title} description={description} toolbar={toolbar}>
    {children}
  </CollapsibleCard>
);

export default KPIContainer;
