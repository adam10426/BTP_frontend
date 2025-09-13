// import { MantineProvider } from '@mantine/core';
// import { Notifications } from '@mantine/notifications';
// import { RouterProvider } from 'react-router-dom';
// import { router } from './routes';
// import '@mantine/core/styles.css';
// import '@mantine/notifications/styles.css';
import AppRouter from './routes';

function App() {
  return (
    <AppRouter />
    // <MantineProvider defaultColorScheme="light">
    //   <Notifications position="top-right" />
    //   <RouterProvider router={router} />
    // </MantineProvider>
  )
}

export default App
