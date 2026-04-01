import React from 'react';
import { DriverStatusProvider } from './DriverStatusContext';
import { DriverDeliveriesProvider } from './DriverDeliveriesContext';
import { DriverEarningsProvider } from './DriverEarningsContext';

export * from './DriverStatusContext';
export * from './DriverDeliveriesContext';
export * from './DriverEarningsContext';

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DriverStatusProvider>
      <DriverDeliveriesProvider>
        <DriverEarningsProvider>
          {children}
        </DriverEarningsProvider>
      </DriverDeliveriesProvider>
    </DriverStatusProvider>
  );
};
