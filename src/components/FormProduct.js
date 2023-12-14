///FormProduct.js
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import apiService from "../service/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import "./FormProduct.css";

const FormProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    trigger,
    getValues,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [apiError, setApiError] = useState(null);

  const loadData = async () => {
    try {
      const products = await apiService.listProducts();
      setData(products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValue(name, value);
  };

  const onSubmit = async (formData) => {
    try {
      const apiUrl = editMode
        ? apiService.updateProduct(editItemId, formData)
        : apiService.createProduct(formData);

      await apiUrl;
      loadData();
      reset();
      setEditMode(false);
      setEditItemId(null);
      setApiError(null);
    } catch (error) {
      setError("form", { type: "server", message: error.response.data.error });
      setApiError(error.response.data.error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await apiService.deleteProduct(itemId);
      loadData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleEdit = (itemId) => {
    const editItem = data.find((item) => item._id === itemId);
    ["name", "detail", "price"].forEach((field) =>
      setValue(field, editItem[field])
    );
    setEditMode(true);
    setEditItemId(itemId);
  };

  return (
    <div>
      <h2>Product List</h2>
      <table className="table">
        <thead>
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Detail</th>
            <th className="table-header">Price</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((item) => (
              <tr key={item._id}>
                <td className="table-cell">{item.name}</td>
                <td className="table-cell">{item.detail}</td>
                <td className="table-cell">{item.price}</td>
                <td className="table-cell">
                  <button
                    style={{ marginRight: "8px" }}
                    onClick={() => deleteItem(item._id)}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(item._id)}
                    style={{ backgroundColor: "blue", color: "white" }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="form-container">
        {editMode && (
          <button
            className="cancel-button"
            onClick={() => {
              setEditMode(false);
              setEditItemId(null);
              reset();
            }}
          >
            <FontAwesomeIcon
              icon={faBan}
              className="icon"
              aria-label="Cancel Edit"
            />
          </button>
        )}

        <h2 className="form-title">
          {editMode ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {["name", "detail", "price"].map((field) => (
            <div key={field} className="input-container">
              <label className="label">
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <input
                  type="text"
                  name={field}
                  {...register(field, {
                    required: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
                  })}
                  className="input ml-5"
                  onChange={handleInputChange}
                />
              </label>
              {errors[field] && (
                <p className="error">{errors[field].message}</p>
              )}
            </div>
          ))}
          {errors.form && <p className="error">{errors.form.message}</p>}
          <button
            type="submit"
            className="submit-button"
            onClick={async () => {
              await trigger();
              if (errors.form || apiError) {
                onSubmit(getValues());
              }
            }}
          >
            {editMode ? "Submit" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormProduct;
