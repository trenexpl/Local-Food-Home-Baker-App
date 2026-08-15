import React from 'react';
import { useApp } from '../../context/AppContext';
import { SingaporeLocationsMap } from './SingaporeLocationsMap';

export const LocationsView: React.FC = () => {
  const { sellers, setViewingSellerId } = useApp();

  return (
    <div id="singapore-locations-page" className="w-full pb-8">
      <SingaporeLocationsMap
        sellers={sellers}
        onSelectSeller={(seller) => {
          // Keep seller in view or allow direct click
        }}
      />
    </div>
  );
};
