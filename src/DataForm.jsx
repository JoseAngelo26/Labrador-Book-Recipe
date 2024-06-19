// DataForm.jsx
import React, { useEffect, useState } from "react";
import axios from 'axios';

const DataForm = () => {
  const API_URL = 'https://creative-biscotti-f2e825.netlify.app/.netlify/functions/api';
  const [data, setData] = useState([]);
  const [recipe, setRecipe] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setData(response.data);
        setFilteredRecipes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  useEffect(() => {
    if (searchInput.trim() === '') {
      setFilteredRecipes(data);
    } else {
      const filtered = data.filter(recipe =>
        recipe.ingredients.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  }, [searchInput, data]);

  const handleSubmit = async (e, id = null) => {
    e.preventDefault();
    if (!recipe.trim() || !ingredients.trim()) {
      setError('Recipe and Ingredients are required');
      return;
    }

    try {
      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? 'put' : 'post';
      const newData = { recipe, ingredients, cuisine };

      const response = await axios({
        method: method,
        url: url,
        data: newData
      });

      const updatedData = id ? data.map(item => (item._id === id ? response.data : item)) : [...data, response.data];

      setData(updatedData);
      setFilteredRecipes(updatedData);
      setRecipe('');
      setIngredients('');
      setCuisine('');
      setError(null);
    } catch (error) {
      console.error('There was an error saving the data!', error);
      setError('An error occurred while saving data.');
    }
  };

  const handleEdit = (_id) => {
    const itemToEdit = data.find((item) => item._id === _id);
    if (itemToEdit) {
      setRecipe(itemToEdit.recipe);
      setIngredients(itemToEdit.ingredients);
      setCuisine(itemToEdit.cuisine);
      setEditItem(_id);
    }
  };

  const handleDelete = (_id) => {
    axios
      .delete(`${API_URL}/${_id}`)
      .then(() => {
        const updatedData = data.filter((item) => item._id !== _id);
        setData(updatedData);
        setFilteredRecipes(updatedData);
      })
      .catch((error) => {
        console.error('There was an error deleting the data!', error);
      });
  };

  const handleUpdate = (e) => {
    handleSubmit(e, editItem);
    setEditItem(null);
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Recipe Book</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Search by ingredients"
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Recipe</th>
            <th>Ingredients</th>
            <th>Cuisine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop through filtered recipes */}
          {filteredRecipes.map((item) => (
            <tr key={item._id}>
              <td>{item.recipe}</td>
              <td>{item.ingredients}</td>
              <td>{item.cuisine}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                <button className="btn btn-success ml-2" onClick={() => handleEdit(item._id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <h2>{editItem ? "Edit Recipe" : "Add New Recipe"}</h2>
      <form onSubmit={editItem ? handleUpdate : handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control mb-2"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="Cuisine"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control mb-2"
            value={recipe}
            onChange={(e) => setRecipe(e.target.value)}
            placeholder="Recipe"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control mb-2"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ingredients"
          />
        </div>
        <button className="btn btn-primary mb-3" type="submit">
          {editItem ? "Update Recipe" : "Add Recipe"}
        </button>
      </form>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default DataForm;
