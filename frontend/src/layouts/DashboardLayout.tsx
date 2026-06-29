import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bus, 
  Users, 
  UserSquare2, 
  Bell, 
  LogOut, 
  LayoutDashboard, 
  Search, 
  User,
  MapPin,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.perfil === 'ADMIN';

  const menuItems = isAdmin
    ? [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Transportes', path: '/admin/transportes', icon: Bus },
        { name: 'Motoristas', path: '/admin/motoristas', icon: UserSquare2 },
        { name: 'Alunos', path: '/admin/alunos', icon: Users },
        { name: 'Avisos', path: '/admin/avisos', icon: Bell },
      ]
    : [
        { name: 'Meu Transporte', path: '/student/my-transport', icon: Bus },
        { name: 'Consultar Transportes', path: '/student/search', icon: Search },
      ];

  const activeItem = menuItems.find(item => location.pathname.startsWith(item.path)) || menuItems[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* 99-inspired Header Nav */}
      <header className="glass fixed top-0 w-full h-16 px-6 z-40 flex items-center justify-between border-b border-zinc-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Bus className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-200">
              OrleansTrans
            </h1>
            <p className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase">
              Universitário
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/40">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-300">
              {user?.perfil === 'ADMIN' ? 'Painel Administrativo' : 'Portal do Estudante'}
            </span>
          </div>

          <div className="flex items-center gap-3 border-l border-zinc-800/80 pl-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-zinc-200">{user?.nome}</span>
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                {user?.email}
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-400">
              <User size={18} />
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 p-2"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Side Menu & main container */}
      <div className="flex flex-1 pt-16 h-[calc(100vh-64px)] relative overflow-hidden">
        
        {/* Uber-inspired Left Navigation Panel */}
        <aside className="hidden md:flex flex-col w-64 bg-zinc-950 border-r border-zinc-800/40 py-6 px-4 shrink-0 justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="px-3 mb-2 text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
              Menu Principal
            </span>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-violet-600/10 border border-violet-500/20 text-violet-400'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="px-3 pt-4 border-t border-zinc-800/60 text-xs text-zinc-500 font-medium">
            Prefeitura de Orleans - SC
          </div>
        </aside>

        {/* Mobile Menu Panel Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-zinc-950 z-30 flex flex-col p-6 animate-fade-in justify-between">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2">
                Navegação
              </span>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-3 rounded-lg text-base font-bold ${
                      isActive
                        ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20'
                        : 'text-zinc-400 hover:bg-zinc-900/50'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 border-t border-zinc-800/80 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-400">
                  <User size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-200">{user?.nome}</span>
                  <span className="text-xs text-zinc-500">{user?.email}</span>
                </div>
              </div>
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                variant="danger"
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sair da Conta
              </Button>
            </div>
          </div>
        )}

        {/* Central Content Panel */}
        <main className="flex-1 overflow-y-auto bg-zinc-900/10 relative p-6">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};
