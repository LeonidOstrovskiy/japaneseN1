import AuthModal from '@/components/modals/AuthModal';
import useHasMounted from '@/hooks/useHasMounted';
import Topbar from '@/shared/Topbar';

const AuthPage: React.FC = () => {
  const hasMounted = useHasMounted();
  if (!hasMounted) {
    return null;
  }
  return (
    <div className="bg-sea-1 w-full h-screen ">
      <Topbar />
      <AuthModal />
    </div>
  );
};

export default AuthPage;
