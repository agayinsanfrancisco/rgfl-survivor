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
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">Castaway Management</span>
        <h1>Keep the roster updated and draft-ready.</h1>
        <p>
          Edit bios, tribes, and hometowns for every Survivor castaway. These details surface throughout the app and in
          weekly results.
        </p>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <div className="rg-flex">
          <div>
            <h3>{form.id ? "Edit Castaway" : "Add Castaway"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
              <label htmlFor="castaway-name">Name</label>
              <input
                id="castaway-name"
                placeholder="Name"
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <label htmlFor="castaway-tribe">Tribe</label>
              <input
                id="castaway-tribe"
                placeholder="Tribe"
                value={form.tribe ?? ""}
                onChange={(e) => setForm({ ...form, tribe: e.target.value })}
              />
              <label htmlFor="castaway-occupation">Occupation</label>
              <input
                id="castaway-occupation"
                placeholder="Occupation"
                value={form.occupation ?? ""}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              />
              <label htmlFor="castaway-hometown">Hometown</label>
              <input
                id="castaway-hometown"
                placeholder="Hometown"
                value={form.hometown ?? ""}
                onChange={(e) => setForm({ ...form, hometown: e.target.value })}
              />
              <label htmlFor="castaway-age">Age</label>
              <input
                id="castaway-age"
                placeholder="Age"
                type="number"
                value={form.age ?? ""}
                onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined })}
                min={18}
              />
              <label htmlFor="castaway-img">Image URL</label>
              <input
                id="castaway-img"
                placeholder="https://..."
                value={form.imageUrl ?? ""}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
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
              {status === "error" && <p className="error">Action failed.</p>}
            </form>
          </div>
          <div>
            <h3>Castaway list</h3>
            <div className="rg-grid" style={{ maxHeight: 480, overflowY: "auto", paddingRight: "0.5rem" }}>
              {castaways.map((c) => (
                <article key={c.id} className="rg-card" style={{ display: "grid", gap: "0.35rem" }}>
                  <strong>{c.name}</strong>
                  <span style={{ color: "var(--text-muted)" }}>{c.tribe ?? "Tribe TBD"}</span>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button type="button" onClick={() => handleEdit(c)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(c.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CastawayManager;
