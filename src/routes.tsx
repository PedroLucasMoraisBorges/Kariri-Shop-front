import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { getProfile } from './pages/api/get-profile'
import EditAddress from './pages/app/address/EditAddress'
import MyAddresses from './pages/app/address/MyAddresses'
import RegisterAddress from './pages/app/address/RegisterAddress'
import { Category } from './pages/app/category'
import { DashboardCompany } from './pages/app/company/dashboard-company'
import { Dashboard } from './pages/app/dashboard'
import AddressConfirmation from './pages/app/product/AddressConfirmation'
import CategoryProductsPage from './pages/app/product/CategoryProductsPage'
import { CreateProduct } from './pages/app/product/createProduct'
import EvaluatePage from './pages/app/product/EvaluatePage'
import OrderSummary from './pages/app/product/OrderSummary'
import ProductPage from './pages/app/product/ProductpPage'
import ProductSearch from './pages/app/product/ProductSearch'
import { CompanyProducts } from './pages/app/product/productsList'
import { ShoppingCart } from './pages/app/product/shoppingCart'
import { DashboardClient } from './pages/app/user/dashboard-client'
import { ActivateUser } from './pages/auth/activate-user'
import { CompleteCompanyRegister } from './pages/auth/cadastro/cadastro-auth/complete-register-company'
import { CreateCompany } from './pages/auth/cadastro/cadastro-auth/register-company'
import { CreateCustomUser } from './pages/auth/cadastro/cadastro-auth/register-user'
import { SignUp } from './pages/auth/cadastro/sign-up'
import { SignIn } from './pages/auth/login/sign-in'
import { ValidateCartCheckoutSession } from './pages/auth/validate-cart-checkout'
import { ValidateCheckoutSession } from './pages/auth/validate-checkout'
import { NotFoundAdmin } from './pages/not_found/404-admin'
import { NotFoundUser } from './pages/not_found/404-client'

// Função para verificar se o usuário é um administrador
const isAdmin = async () => {
  const user = await getProfile()

  if (!user) {
    return false
  } else if (user.is_company) {
    return true
  }
  return false
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: (await isAdmin()) ? <NotFoundAdmin /> : <NotFoundUser />,
    children: [
      {
        path: '/',
        element: (await isAdmin()) ? (
          <Dashboard />
        ) : (
          <NotFoundUser /> || <NotFoundAdmin />
        ),
      },

      /** Cliente */
      {
        path: '/dashboard-client',
        element: <DashboardClient />,
      },
      {
        path: '/shoppingCart',
        element: <ShoppingCart />,
      },
      {
        path: '/productsFromCategory/:id',
        element: <CategoryProductsPage />,
      },
      {
        path: '/searchProducts/:search?',
        element: <ProductSearch />,
      },

      // AddressConfirmation
      {
        path: '/addressConfirmation/product/:routeProdId',
        element: <AddressConfirmation />,
      },
      {
        path: '/addressConfirmation/cart/:routeCartId',
        element: <AddressConfirmation />,
      },
      // Order Summary
      {
        path: '/orderSummary/product/:routeProdId',
        element: <OrderSummary />,
      },
      {
        path: '/orderSummary/cart/:routeCartId',
        element: <OrderSummary />,
      },
      // My Addresses
      {
        path: '/myAddresses/:type?/:id?',
        element: <MyAddresses />,
      },
      {
        path: '/registerAddress',
        element: <RegisterAddress />,
      },
      {
        path: '/editAddress/:id',
        element: <EditAddress />,
      },
      {
        path: '/productPage/:id',
        element: <ProductPage />,
      },
      {
        path: '/evaluateProduct/:id',
        element: <EvaluatePage />,
      },
      /** Admin */
      {
        path: '/dashboard-company',
        element: (await isAdmin()) ? <DashboardCompany /> : <NotFoundAdmin />,
      },
      {
        path: '/category',
        element: (await isAdmin()) ? <Category /> : <NotFoundUser />,
      },
      {
        path: '/createProduct',
        element: (await isAdmin()) ? <CreateProduct /> : <NotFoundUser />,
      },
      {
        path: '/viewMyProducts',
        element: (await isAdmin()) ? <CompanyProducts /> : <NotFoundUser />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: '/createCompany', element: <CreateCompany /> },
      { path: '/createCustomUser', element: <CreateCustomUser /> },
      {
        path: '/completeCompanyRegister',
        element: <CompleteCompanyRegister />,
      },
    ],
  },
  {
    path: '/activateUser/:id',
    element: <ActivateUser />,
  },
  {
    path: '/checkout/success/:sessionId',
    element: <ValidateCheckoutSession />,
  },
  {
    path: '/checkout/cart/success/:sessionId',
    element: <ValidateCartCheckoutSession />,
  },
])
