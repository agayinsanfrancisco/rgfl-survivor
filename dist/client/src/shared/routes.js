// client/src/shared/routes.ts
export const routes = {
    root: "/",
    splash: "/",
    login: "/login",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    dashboard: "/dashboard",
    profile: "/profile",
    weeklyPicks: "/weekly-picks",
    weeklyResults: "/weekly-results",
    preseasonRank: "/preseason-rank",
    leaderboard: "/leaderboard",
    castaway: (id) => `/castaway/${id}`,
    notFound: "*",
    // Admin
    admin: {
        index: "/admin",
        dashboard: "/admin",
        castaways: "/admin/castaways",
        users: "/admin/users",
        league: "/admin/league",
        picks: "/admin/picks",
        points: "/admin/points",
        season: "/admin/season",
        stats: "/admin/stats"
    }
};
