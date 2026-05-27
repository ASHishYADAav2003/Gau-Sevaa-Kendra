import { RouterProvider } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#E8F5E9',
                color: '#2E7D32',
                border: '1px solid #A5D6A7',
              },
              iconTheme: { primary: '#2E7D32', secondary: '#E8F5E9' },
            },
            error: {
              style: {
                background: '#FDECEA',
                color: '#c02b2bff',
                border: '1px solid #FFCDD2',
              },
            },
          }}
        />
      </SettingsProvider>
    </LanguageProvider>
  );
}