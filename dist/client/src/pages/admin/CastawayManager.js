import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
const CastawayProfile = () => {
    const { id } = useParams();
    const [castaway, setCastaway] = useState(null);
    useEffect(() => {
        if (id) {
            api.get(`/api/castaways/${id}`).then(setCastaway);
        }
    }, [id]);
    if (!castaway)
        return _jsx("div", { children: "Loading castaway..." });
    return (_jsxs("div", { className: "castaway-profile", children: [_jsx("h2", { children: castaway.name }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("b", { children: "Age:" }), " ", castaway.age] }), _jsxs("li", { children: [_jsx("b", { children: "Tribe:" }), " ", castaway.tribe] }), _jsxs("li", { children: [_jsx("b", { children: "Occupation:" }), " ", castaway.occupation] })] })] }));
};
export default CastawayProfile;
