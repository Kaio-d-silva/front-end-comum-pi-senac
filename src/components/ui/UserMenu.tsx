import React, { useState, useRef, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';

interface UserMenuLinkOption {
  label: string;
  to: string;
}

interface UserMenuActionOption {
  label: string;
  onClick: () => void;
}

export type UserMenuOption = UserMenuLinkOption | UserMenuActionOption;

interface UserMenuProps {
  options?: UserMenuOption[];
}

const UserMenu: React.FC<UserMenuProps> = ({ options }) => {
  const authContext = React.useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  if (!authContext) throw new Error('AuthContext não está disponível');

  const { usuario } = authContext;

  // fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultOptions: UserMenuOption[] = [
    { label: 'Meus Dados', to: '/user/details' },
    { label: 'Sair', to: '/logout' },
  ];

  const menuOptions = options || defaultOptions;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300 transition"
      >
        <FiUser size={22} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 z-50">
          <div className="p-3 border-b">
            <p className="text-sm font-semibold">{usuario?.email}</p>
            <p className="text-xs text-gray-500">{usuario?.role}</p>
          </div>

          {menuOptions.map((opt, i) =>
            'to' in opt ? (
              <Link
                key={i}
                to={opt.to}
                className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                onClick={() => setOpen(false)}
              >
                {opt.label}
              </Link>
            ) : (
              <button
                key={i}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                onClick={() => {
                  setOpen(false);
                  opt.onClick();
                }}
              >
                {opt.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
