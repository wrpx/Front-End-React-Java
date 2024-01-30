///FormProduct.js
import React, { useEffect, useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import apiService from "../../service/apiService";
import "./FormProduct.css";

const FormProduct = () => {
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm();

  const loadData = useCallback(async () => {
    try {
      const products = await apiService.listProducts();
      setData(products);
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiError("Error fetching data");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = ({ target: { name, value } }) =>
    setValue(name, value);

  const onSubmit = async (formData) => {
    try {
      const action = editMode
        ? apiService.updateProduct(editItemId, formData)
        : apiService.createProduct(formData);
      await action;
      setEditMode(false);
      setEditItemId(null);
      reset();
      loadData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unspecified error occurred.";
      setApiError(errorMessage);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await apiService.deleteProduct(itemId);
      loadData();
    } catch (error) {
      console.error("Error deleting data:", error);
      setApiError("Error deleting data");
    }
  };

  const handleEdit = (itemId) => {
    const editItem = data.find((item) => item.id === itemId);
    for (const field of ["name", "detail", "price"]) {
      setValue(field, editItem[field]);
    }
    setEditMode(true);
    setEditItemId(itemId);
  };

  return (
    <div className="main">
      <h2 className="form-title">React-JavaSpring CRUD</h2>
      <div className="container-table">
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
            {data.map((item) => (
              <tr key={item.id}>
                <td className="table-cell">{item.name}</td>
                <td className="table-cell">{item.detail}</td>
                <td className="table-cell">{item.price}</td>
                <td className="table-cell">
                  <div className="button-container">
                    <button
                      className="delete"
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="edit"
                      onClick={() => handleEdit(item.id)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-container">
        {editMode && (
          <button
            className="cancel-button rounded-[100px]"
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
