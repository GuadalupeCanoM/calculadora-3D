'use client';

import React, { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // La funcionalidad de autenticación ha sido eliminada. Este componente simplemente
  // renderiza a sus hijos para evitar errores de compilación.
  return <>{children}</>;
}
