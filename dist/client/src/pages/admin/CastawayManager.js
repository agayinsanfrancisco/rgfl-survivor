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
    return (_jsxs("div", { className: "castaway-manager", children: [_jsx("h2", { children: "Castaway Manager" }), _jsxs("div", { style: { display: "flex", gap: 24, flexWrap: "wrap" }, children: [_jsxs("div", { style: { flex: "1 1 300px" }, children: [_jsx("h3", { children: form.id ? "Edit Castaway" : "Add Castaway" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { placeholder: "Name", value: form.name ?? "", onChange: e => setForm({ ...form, name: e.target.value }), required: true }), _jsx("input", { placeholder: "Tribe", value: form.tribe ?? "", onChange: e => setForm({ ...form, tribe: e.target.value }) }), _jsx("input", { placeholder: "Occupation", value: form.occupation ?? "", onChange: e => setForm({ ...form, occupation: e.target.value }) }), _jsx("input", { placeholder: "Hometown", value: form.hometown ?? "", onChange: e => setForm({ ...form, hometown: e.target.value }) }), _jsx("input", { placeholder: "Image URL", value: form.imageUrl ?? "", onChange: e => setForm({ ...form, imageUrl: e.target.value }) }), _jsx("input", { placeholder: "Age", type: "number", value: form.age ?? "", onChange: e => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined }), min: 18 }), _jsxs("div", { style: { display: "flex", gap: 8 }, children: [_jsx("button", { type: "submit", disabled: status === "saving", children: status === "saving" ? "Saving..." : form.id ? "Update" : "Create" }), form.id && (_jsx("button", { type: "button", onClick: resetForm, children: "Cancel" }))] }), status === "success" && _jsx("p", { style: { color: "green" }, children: "Saved!" }), status === "error" && _jsx("p", { style: { color: "crimson" }, children: "Action failed." })] })] }), _jsxs("div", { style: { flex: "2 1 400px" }, children: [_jsx("h3", { children: "Existing Castaways" }), _jsx("ul", { children: castaways.map(c => (_jsxs("li", { style: { marginBottom: 8 }, children: [_jsx("strong", { children: c.name }), " \u2014 ", c.tribe ?? "Unknown tribe", _jsxs("div", { style: { marginTop: 4 }, children: [_jsx("button", { type: "button", onClick: () => handleEdit(c), style: { marginRight: 8 }, children: "Edit" }), _jsx("button", { type: "button", onClick: () => handleDelete(c.id), children: "Delete" })] })] }, c.id))) })] })] })] }));
};
export default CastawayManager;
