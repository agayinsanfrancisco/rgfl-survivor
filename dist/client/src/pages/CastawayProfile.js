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
        return _jsx("div", { className: "rg-page", children: "Loading castaway..." });
    if (err)
        return _jsx("div", { className: "rg-page", style: { color: "crimson" }, children: err });
    if (!castaway)
        return _jsx("div", { className: "rg-page", children: "Castaway not found." });
    return (_jsx("div", { className: "rg-page", children: _jsxs("section", { className: "rg-section", style: { maxWidth: 600 }, children: [_jsx(Link, { to: routes.dashboard, style: { marginBottom: "1rem", display: "inline-flex" }, children: "\u2190 Back to dashboard" }), _jsx("h2", { children: castaway.name }), _jsx("p", { style: { color: "var(--text-muted)" }, children: castaway.tribe ? `${castaway.tribe} tribe` : "" }), _jsxs("div", { className: "rg-grid", style: { marginTop: "1.5rem" }, children: [_jsxs("div", { className: "rg-card", children: [_jsx("strong", { children: "Age" }), _jsx("p", { children: castaway.age ?? "–" })] }), _jsxs("div", { className: "rg-card", children: [_jsx("strong", { children: "Occupation" }), _jsx("p", { children: castaway.occupation ?? "–" })] }), _jsxs("div", { className: "rg-card", children: [_jsx("strong", { children: "Hometown" }), _jsx("p", { children: castaway.hometown ?? "–" })] })] }), _jsx("div", { style: { marginTop: "2rem" }, children: _jsx(Link, { to: routes.weeklyPicks, children: _jsx("button", { children: "Set Weekly Pick" }) }) })] }) }));
};
export default CastawayProfile;
