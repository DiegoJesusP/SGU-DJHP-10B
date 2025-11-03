import React, { useEffect, useState } from "react";
import api from './../../api/axios-client';
import "bootstrap/dist/css/bootstrap.min.css";

const UserPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await api.get("/user");
      setUsuarios(res.data);
      console.log("Usuarios obtenidos:", res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (usuarioSeleccionado) {
        await api.put(`/user/${usuarioSeleccionado.id}`, formData);
      } else {
        await api.post("/user", formData);
      }
      obtenerUsuarios();
      closeModal();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await api.delete(`/user/${id}`);
        obtenerUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const newUser = () => {
    setUsuarioSeleccionado(null);
    setFormData({ name: "", email: "", phone: "" });
    setShowModal(true);
  };

  const updateUser = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setFormData({
      name: usuario.name,
      email: usuario.email,
      phone: usuario.phone,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container-fluid mt-4">
      <h2>Gestión de Usuarios</h2>
      <button className="btn btn-primary my-3" onClick={newUser}>
        Nuevo Usuario
      </button>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="w-25" style={{ minWidth: "180px" }}>Nombre Completo</th>
              <th className="w-25" style={{ minWidth: "220px" }}>Correo</th>
              <th className="w-20" style={{ minWidth: "140px" }}>Teléfono</th>
              <th style={{ minWidth: "150px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="text-wrap" style={{ whiteSpace: "normal" }}>{u.name}</td>
                  <td className="text-wrap" style={{ whiteSpace: "normal" }}>{u.email}</td>
                  <td className="text-wrap" style={{ whiteSpace: "normal" }}>{u.phone}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info me-3"
                      onClick={() => updateUser(u)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {usuarioSeleccionado ? "Editar Usuario" : "Nuevo Usuario"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <label className="form-label">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Número de Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default UserPage;
