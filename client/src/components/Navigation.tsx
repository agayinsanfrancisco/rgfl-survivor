import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";

const navLinks = [
  { label: "Home", to: routes.root },
  { label: "About", to: routes.about },
  { label: "Weekly Picks", to: routes.weeklyPicks },
  { label: "Global leaderboard", to: routes.leaderboard },
  { label: "League", to: routes.league },
  { label: "Contact", to: routes.contact },
  { label: "Rules", to: routes.rules }
];

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(routes.login);
  };

  return (
    <header className="rg-nav">
      <div
        className="rg-nav__brand"
        onClick={() => navigate(routes.root)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") navigate(routes.root);
        }}
        role="button"
        tabIndex={0}
      >
        <span className="rg-nav__logo">Reality Games</span>
        <span className="rg-nav__subtitle">Fantasy League</span>
      </div>
      <nav className="rg-nav__links">
        {navLinks.map((link) => {
          const active = location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
          return (
            <Link key={link.to} to={link.to} className={active ? "active" : undefined}>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="rg-nav__actions">
        {user ? (
          <>
            <button className="rg-nav__bell" aria-label="Notifications">
              🔔
            </button>
            {user.isAdmin && (
              <Link to={routes.admin.index} className="rg-nav__admin">
                Admin
              </Link>
            )}
            <div className="rg-nav__avatar" title={user.name}>
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <button className="rg-nav__auth" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="rg-nav__auth" onClick={() => navigate(routes.login)}>
              Login
            </button>
            <button className="rg-nav__cta" onClick={() => navigate(routes.signup)}>
              Join the League
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navigation;
