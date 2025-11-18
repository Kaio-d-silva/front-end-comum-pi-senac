import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import DetalhesPrato from '../components/DetalhesPrato';
import FormularioPrato from '../components/FormularioPrato';
import HomeCliente from '../components/HomeCliente';
import ShoppingCart from '../components/ShoppingCart';
import { AuthProvider } from '../context/authContext';
import { CartProvider } from '../context/cartContext';
import RestrictedLayout from '../layout/RestrictedLayout';
import Home from '../views/Home';
import Login from '../views/Login';
import OrderManagement from '../views/OrderManagement';
import UserForm from '../views/UserForm';
import UserManagement from '../views/UserManagement';
import FormularioPedido from '../components/FormularioPedido';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <CartProvider>
        <HomeCliente />
      </CartProvider>
    ),
  },
  {
    path: '/detalhes/:id',
    element: (
      <CartProvider>
        <DetalhesPrato />
      </CartProvider>
    ),
  },
  {
    path: '/carrinho',
    element: (
      <CartProvider>
        <ShoppingCart />
      </CartProvider>
    ),
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: (
          <AuthProvider>
            <RestrictedLayout />
          </AuthProvider>
        ),
        children: [
          {
            path: '',
            element: <Navigate to="home" replace />,
          },
          {
            path: 'novo-prato',
            element: <FormularioPrato />,
          },
          {
            path: 'detalhes-prato/:id',
            element: <FormularioPrato isEditing />,
          },
          {
            path: 'home',
            element: <Home />,
          },
          {
            path: 'usuarios',
            element: <UserManagement />,
          },
          {
            path: 'usuarios/novo',
            element: <UserForm />,
          },
          {
            path: 'usuarios/editar/:id',
            element: <UserForm isEditing />,
          },
          {
            path: 'pedidos',
            element: <OrderManagement />,
          },
          {
            path: 'pedidos/novo',
            element: <FormularioPedido />,
          },
          {
            path: 'pedidos/editar/:id',
            element: <FormularioPrato isEditing />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default routes;
