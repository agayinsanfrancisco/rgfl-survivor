import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import PointsManager from "@/pages/admin/PointsManagaer";
import SeasonManager from "@/pages/admin/SeasonManager";
import StatsDashboard from "@/pages/admin/StatsDashboard";
import { routes } from "@/shared/routes";

const App = () => (
  <Router>
    <Navigation />
    <Routes>
        <Route path={routes.root} element={<Splash />} />
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.signup} element={<Signup />} />
        <Route path={routes.forgotPassword} element={<ForgotPassword />} />
        <Route path={routes.resetPassword} element={<ResetPassword />} />

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
        <Route path={routes.admin.points} element={<AdminRoute><PointsManager /></AdminRoute>} />
        <Route path={routes.admin.season} element={<AdminRoute><SeasonManager /></AdminRoute>} />
        <Route path={routes.admin.stats} element={<AdminRoute><StatsDashboard /></AdminRoute>} />

        <Route path={routes.notFound} element={<NotFound />} />
      </Routes>
    </Router>
);

export default App;