import type { RouteObject } from 'react-router';
import AppLayout from '@/appLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ShippingRequest from './pages/ShippingRequest';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
        handle: { showInNavigation: true, label: 'Home' },
      },
      {
        path: 'shipping-request',
        element: <ShippingRequest />,
        handle: { showInNavigation: true, label: 'Shipping Request' },
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
