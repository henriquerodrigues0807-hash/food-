import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface DriverPrivateRouteProps {
  children: React.ReactNode;
}

const DriverPrivateRoute = ({ children }: DriverPrivateRouteProps) => {
  const { user } = useAuth();
  const { slug } = useParams<{ slug: string }>();

  if (!user) return <Navigate to={`/delivery/${slug}/onboarding`} replace />;
  if (user.tipo !== 'entregador') return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default DriverPrivateRoute;
