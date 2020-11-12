/* eslint-disable react/no-array-index-key */
import React, {
  lazy,
  Suspense,
  Fragment
} from 'react';
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import Layout from 'container/Layout';
import LoadingScreen from 'components/LoadingScreen';

const routesConfig = [
  {
    path: '*',
    layout: Layout,
    routes: [
      {
        exact: true,
        path: '/',
        component: lazy(() => import('pages/Game'))
      },
      {
        exact: true,
        path: '/:id',
        component: lazy(() => import('pages/PlayBacks'))
      }
    ]
  }
];

const renderRoutes = (routes) => (routes ? (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Layout>
                {route.routes
                  ? renderRoutes(route.routes)
                  : <Component {...props} />}
              </Layout>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
) : null);

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
