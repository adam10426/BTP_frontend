import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import BaseHeader from './BaseHeader';
import BaseSidebar from './BaseSidebar';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-red-600">Something went wrong in the layout:</h2>
      <pre className="mt-2 p-4 bg-gray-100 rounded text-sm text-red-500">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}

const BaseLayout = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();

  return (
        <AppShell
          layout="alt"
          header={{ height: 60 }}
          navbar={{
            width: 250,
            breakpoint: 'sm',
            collapsed: { mobile: !mobileOpened },
          }}
          style={{overflow:'hidden'}}
          padding="md"
        >
          <AppShell.Header withBorder={false}>
            <BaseHeader 
              opened={mobileOpened} 
              toggle={toggleMobile} 
            />
          </AppShell.Header>

          <AppShell.Navbar>
            <BaseSidebar toggle={toggleMobile} isMobile={mobileOpened}/>
          </AppShell.Navbar>

          <AppShell.Main >
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Outlet />
              </ErrorBoundary>
          </AppShell.Main>
        </AppShell>
  );
};

export default BaseLayout;
