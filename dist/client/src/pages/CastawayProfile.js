import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { routes } from "@/shared/routes";
const CastawayProfile = () => {
    const { id } = useParams();
    const [castaway, setCastaway] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    useEffect(() => {
        if (!id) {
            setErr("Missing castaway ID");
            setLoading(false);
            return;
        }
        api.get(`/api/castaways/${id}`)
            .then(res => setCastaway(res.data))
            .catch(() => setErr("Could not fetch castaway."))
            .finally(() => setLoading(false));
    }, [id]);
    if (loading)
        return _jsx("div", { className: "container", children: "Loading castaway..." });
    if (err)
        return _jsx("div", { className: "container", style: { color: "crimson" }, children: err });
    if (!castaway)
        return _jsx("div", { className: "container", children: "Castaway not found." });
    return (_jsxs("div", { className: "container", children: [_jsx(Link, { to: routes.dashboard, children: "\u2190 Back to Dashboard" }), _jsx("h2", { children: castaway.name }), _jsx("table", { children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("th", { children: "Tribe:" }), _jsx("td", { children: castaway.tribe })] }), _jsxs("tr", { children: [_jsx("th", { children: "Age:" }), _jsx("td", { children: castaway.age })] }), _jsxs("tr", { children: [_jsx("th", { children: "Occupation:" }), _jsx("td", { children: castaway.occupation })] }), _jsxs("tr", { children: [_jsx("th", { children: "Hometown:" }), _jsx("td", { children: castaway.hometown })] })] }) }), _jsx("div", { style: { marginTop: "2em" }, children: _jsx(Link, { to: routes.weeklyPicks, className: "button", children: "Make Weekly Picks" }) })] }));
};
export default CastawayProfile;
