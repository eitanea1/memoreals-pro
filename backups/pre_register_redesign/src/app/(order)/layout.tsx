import { AppProvider } from '@/context/AppContext';

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
