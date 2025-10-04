import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const defaultForm = {
    id: undefined,
    name: "",
    tribe: "",
    occupation: "",
    age: undefined,
    hometown: "",
    imageUrl: ""
};
const CastawayManager = () => {
    const [castaways, setCastaways] = useState([]);
    const [form, setForm] = useState(defaultForm);
    const [status, setStatus] = useState("idle");
    const loadCastaways = async () => {
        try {
            const res = await api.get("/api/castaways");
            setCastaways(res.data);
        }
        catch (error) {
            console.error("Failed to load castaways:", error);
        }
    };
    useEffect(() => {
        loadCastaways();
    }, []);
    const resetForm = () => {
        setForm(defaultForm);
        setStatus("idle");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name) {
            setStatus("error");
            return;
        }
        setStatus("saving");
        try {
            const payload = {
                name: form.name,
                tribe: form.tribe,
                occupation: form.occupation,
                hometown: form.hometown,
                imageUrl: form.imageUrl,
                age: form.age ? Number(form.age) : undefined
            };
            if (form.id) {
                await api.put(`/api/admin/castaway/${form.id}`, payload);
            }
            else {
                await api.post("/api/admin/castaway", payload);
            }
            await loadCastaways();
            resetForm();
            setStatus("success");
        }
        catch (error) {
            console.error("Failed to save castaway:", error);
            setStatus("error");
        }
    };
    const handleEdit = (castaway) => {
        setForm({
            id: castaway.id,
            name: castaway.name,
            tribe: castaway.tribe,
            occupation: castaway.occupation,
            hometown: castaway.hometown,
            imageUrl: castaway.imageUrl,
            age: castaway.age
        });
        setStatus("idle");
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this castaway?"))
            return;
        try {
            await api.delete(`/api/admin/castaway/${id}`);
            await loadCastaways();
            if (form.id === id) {
                resetForm();
            }
        }
        catch (error) {
            console.error("Failed to delete castaway:", error);
            setStatus("error");
        }
    };
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", children: [_jsx("span", { className: "rg-pill", children: "Castaway Management" }), _jsx("h1", { children: "Keep the roster updated and draft-ready." }), _jsx("p", { children: "Edit bios, tribes, and hometowns for every Survivor castaway. These details surface throughout the app and in weekly results." })] }), _jsx("section", { className: "rg-section", style: { marginTop: "3rem" }, children: _jsxs("div", { className: "rg-flex", children: [_jsxs("div", { children: [_jsx("h3", { children: form.id ? "Edit Castaway" : "Add Castaway" }), _jsxs("form", { onSubmit: handleSubmit, style: { display: "grid", gap: "0.75rem", marginTop: "1rem" }, children: [_jsx("label", { htmlFor: "castaway-name", children: "Name" }), _jsx("input", { id: "castaway-name", placeholder: "Name", value: form.name ?? "", onChange: (e) => setForm({ ...form, name: e.target.value }), required: true }), _jsx("label", { htmlFor: "castaway-tribe", children: "Tribe" }), _jsx("input", { id: "castaway-tribe", placeholder: "Tribe", value: form.tribe ?? "", onChange: (e) => setForm({ ...form, tribe: e.target.value }) }), _jsx("label", { htmlFor: "castaway-occupation", children: "Occupation" }), _jsx("input", { id: "castaway-occupation", placeholder: "Occupation", value: form.occupation ?? "", onChange: (e) => setForm({ ...form, occupation: e.target.value }) }), _jsx("label", { htmlFor: "castaway-hometown", children: "Hometown" }), _jsx("input", { id: "castaway-hometown", placeholder: "Hometown", value: form.hometown ?? "", onChange: (e) => setForm({ ...form, hometown: e.target.value }) }), _jsx("label", { htmlFor: "castaway-age", children: "Age" }), _jsx("input", { id: "castaway-age", placeholder: "Age", type: "number", value: form.age ?? "", onChange: (e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined }), min: 18 }), _jsx("label", { htmlFor: "castaway-img", children: "Image URL" }), _jsx("input", { id: "castaway-img", placeholder: "https://...", value: form.imageUrl ?? "", onChange: (e) => setForm({ ...form, imageUrl: e.target.value }) }), _jsxs("div", { style: { display: "flex", gap: "0.75rem", marginTop: "0.5rem" }, children: [_jsx("button", { type: "submit", disabled: status === "saving", children: status === "saving" ? "Saving..." : form.id ? "Update" : "Create" }), form.id && (_jsx("button", { type: "button", onClick: resetForm, children: "Cancel" }))] }), status === "success" && _jsx("p", { style: { color: "green" }, children: "Saved!" }), status === "error" && _jsx("p", { className: "error", children: "Action failed." })] })] }), _jsxs("div", { children: [_jsx("h3", { children: "Castaway list" }), _jsx("div", { className: "rg-grid", style: { maxHeight: 480, overflowY: "auto", paddingRight: "0.5rem" }, children: castaways.map((c) => (_jsxs("article", { className: "rg-card", style: { display: "grid", gap: "0.35rem" }, children: [_jsx("strong", { children: c.name }), _jsx("span", { style: { color: "var(--text-muted)" }, children: c.tribe ?? "Tribe TBD" }), _jsxs("div", { style: { display: "flex", gap: "0.5rem", marginTop: "0.5rem" }, children: [_jsx("button", { type: "button", onClick: () => handleEdit(c), children: "Edit" }), _jsx("button", { type: "button", onClick: () => handleDelete(c.id), children: "Delete" })] })] }, c.id))) })] })] }) })] }));
};
export default CastawayManager;
