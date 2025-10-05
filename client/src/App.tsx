import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Splash from "@/pages/Splash";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/UserProfile";
import WeeklyPicks from "@/pages/WeeklyPicks";
import WeeklyResults from "@/pages/WeeklyResults";
import PreseasonRank from "@/pages/PreseasonRank";
import Leaderboard from "@/pages/Leaderboard";
import CastawayProfile from "@/pages/CastawayProfile";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
// Admin
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CastawayManager from "@/pages/admin/CastawayManager";
import UserManager from "@/pages/admin/UserManager";
import LeagueManager from "@/pages/admin/LeagueManager";
import PicksManager from "@/pages/admin/PicksManager";
import PointsManager from "@/pages/admin/PointsManager";
import SeasonManager from "@/pages/admin/SeasonManager";
import StatsDashboard from "@/pages/admin/StatsDashboard";
import AnalyticsDashboard from "@/pages/admin/AnalyticsDashboard";
import HeadToHeadComparison from "@/pages/admin/HeadToHeadComparison";
import { routes } from "@/shared/routes";
import About from "@/pages/About";
import HowToPlay from "@/pages/HowToPlay";
import Contact from "@/pages/Contact";
import Rules from "@/pages/Rules";
import LeagueOverview from "@/pages/LeagueOverview";

const App = () => {
  const { loading } = useAuth();
  const location = useLocation();

  const hideChromeRoutes = new Set<string>([
    routes.login,
    routes.signup,
    routes.forgotPassword,
    routes.resetPassword
  ]);

  const showChrome = !hideChromeRoutes.has(location.pathname);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="rg-app">
      {showChrome && <Navigation />}
      <Routes>
        <Route path={routes.root} element={<Splash />} />
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.signup} element={<Signup />} />
        <Route path={routes.forgotPassword} element={<ForgotPassword />} />
        <Route path={routes.resetPassword} element={<ResetPassword />} />

        <Route path={routes.about} element={<About />} />
        <Route path={routes.contact} element={<Contact />} />
        <Route path={routes.rules} element={<Rules />} />
        <Route path={routes.howToPlay} element={<HowToPlay />} />
        <Route path={routes.league} element={<LeagueOverview />} />

        <Route path={routes.dashboard} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path={routes.profile} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path={routes.weeklyPicks} element={<ProtectedRoute><WeeklyPicks /></ProtectedRoute>} />
        <Route path={routes.weeklyResults} element={<ProtectedRoute><WeeklyResults /></ProtectedRoute>} />
        <Route path={routes.preseasonRank} element={<ProtectedRoute><PreseasonRank /></ProtectedRoute>} />
        <Route path={routes.leaderboard} element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/castaway/:id" element={<ProtectedRoute><CastawayProfile /></ProtectedRoute>} />

        <Route path={routes.admin.index} element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path={routes.admin.castaways} element={<AdminRoute><CastawayManager /></AdminRoute>} />
        <Route path={routes.admin.users} element={<AdminRoute><UserManager /></AdminRoute>} />
        <Route path={routes.admin.league} element={<AdminRoute><LeagueManager /></AdminRoute>} />
        <Route path={routes.admin.picks} element={<AdminRoute><PicksManager /></AdminRoute>} />
        <Route path={routes.admin.scoring} element={<AdminRoute><PointsManager /></AdminRoute>} />
        <Route path={routes.admin.season} element={<AdminRoute><SeasonManager /></AdminRoute>} />
        <Route path={routes.admin.stats} element={<AdminRoute><StatsDashboard /></AdminRoute>} />
        <Route path={routes.admin.analytics} element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
        <Route path={routes.admin.headToHead} element={<AdminRoute><HeadToHeadComparison /></AdminRoute>} />

        <Route path={routes.notFound} element={<NotFound />} />
      </Routes>
      {showChrome && (
        <footer className="rg-footer">
          Reality Games Fantasy League · Outwit · Outplay · Outscore
        </footer>
      )}
    </div>
  );
};

export default App;
