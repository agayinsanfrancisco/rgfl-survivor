import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Castaway } from "@/shared/types";

type CastawayFormState = Partial<Castaway> & { id?: string };

const defaultForm: CastawayFormState = {
  id: undefined,
  name: "",
  tribe: "",
  occupation: "",
  age: undefined,
  hometown: "",
  imageUrl: ""
};

const CastawayManager = () => {
  const [castaways, setCastaways] = useState<Castaway[]>([]);
  const [form, setForm] = useState<CastawayFormState>(defaultForm);
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "success">("idle");

  const loadCastaways = async () => {
    try {
      const res = await api.get("/api/castaways");
      setCastaways(res.data);
    } catch (error) {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else {
        await api.post("/api/admin/castaway", payload);
      }

      await loadCastaways();
      resetForm();
      setStatus("success");
    } catch (error) {
      console.error("Failed to save castaway:", error);
      setStatus("error");
    }
  };

  const handleEdit = (castaway: Castaway) => {
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this castaway?")) return;
    try {
      await api.delete(`/api/admin/castaway/${id}`);
      await loadCastaways();
      if (form.id === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Failed to delete castaway:", error);
      setStatus("error");
    }
  };

  return (
    <div className="castaway-manager">
      <h2>Castaway Manager</h2>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px" }}>
          <h3>{form.id ? "Edit Castaway" : "Add Castaway"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Name"
              value={form.name ?? ""}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Tribe"
              value={form.tribe ?? ""}
              onChange={e => setForm({ ...form, tribe: e.target.value })}
            />
            <input
              placeholder="Occupation"
              value={form.occupation ?? ""}
              onChange={e => setForm({ ...form, occupation: e.target.value })}
            />
            <input
              placeholder="Hometown"
              value={form.hometown ?? ""}
              onChange={e => setForm({ ...form, hometown: e.target.value })}
            />
            <input
              placeholder="Image URL"
              value={form.imageUrl ?? ""}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            />
            <input
              placeholder="Age"
              type="number"
              value={form.age ?? ""}
              onChange={e => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined })}
              min={18}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" disabled={status === "saving"}>
                {status === "saving" ? "Saving..." : form.id ? "Update" : "Create"}
              </button>
              {form.id && (
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
            {status === "success" && <p style={{ color: "green" }}>Saved!</p>}
            {status === "error" && <p style={{ color: "crimson" }}>Action failed.</p>}
          </form>
        </div>
        <div style={{ flex: "2 1 400px" }}>
          <h3>Existing Castaways</h3>
          <ul>
            {castaways.map(c => (
              <li key={c.id} style={{ marginBottom: 8 }}>
                <strong>{c.name}</strong> — {c.tribe ?? "Unknown tribe"}
                <div style={{ marginTop: 4 }}>
                  <button type="button" onClick={() => handleEdit(c)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CastawayManager;
