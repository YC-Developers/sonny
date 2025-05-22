import { useState, useEffect } from 'react';
import { sparePartApi } from '../services/api';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';

const SpareParts = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSparePart, setCurrentSparePart] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit_price: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const response = await sparePartApi.getAll();
      setSpareParts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching spare parts:', err);
      setError('Failed to load spare parts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const handleOpenModal = (sparePart = null) => {
    if (sparePart) {
      setCurrentSparePart(sparePart);
      setFormData({
        name: sparePart.name,
        category: sparePart.category,
        quantity: sparePart.quantity,
        unit_price: sparePart.unit_price
      });
    } else {
      setCurrentSparePart(null);
      setFormData({
        name: '',
        category: '',
        quantity: 0,
        unit_price: ''
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    if (!formData.unit_price) {
      errors.unit_price = 'Unit price is required';
    } else if (isNaN(formData.unit_price) || parseFloat(formData.unit_price) <= 0) {
      errors.unit_price = 'Unit price must be a positive number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (currentSparePart) {
        // Update existing spare part
        await sparePartApi.update(currentSparePart.id, formData);
      } else {
        // Create new spare part
        await sparePartApi.create(formData);
      }

      fetchSpareParts();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving spare part:', err);
      setError('Failed to save spare part');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this spare part?')) {
      try {
        await sparePartApi.delete(id);
        fetchSpareParts();
      } catch (err) {
        console.error('Error deleting spare part:', err);
        setError('Failed to delete spare part');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    {
      key: 'unit_price',
      label: 'Unit Price',
      render: (row) => `$${parseFloat(row.unit_price).toFixed(2)}`
    },
    {
      key: 'total_price',
      label: 'Total Price',
      render: (row) => `$${parseFloat(row.total_price).toFixed(2)}`
    }
  ];

  // Actions removed for security purposes

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Spare Parts</h1>
        <Button onClick={() => handleOpenModal()}>Add New Spare Part</Button>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <Table
          columns={columns}
          data={spareParts}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentSparePart ? 'Edit Spare Part' : 'Add New Spare Part'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name}
          />
          <Input
            label="Category"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={formErrors.category}
          />
          <Input
            label="Unit Price"
            id="unit_price"
            name="unit_price"
            type="number"
            step="0.01"
            value={formData.unit_price}
            onChange={handleChange}
            error={formErrors.unit_price}
          />
          <div className="flex justify-end mt-6 space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit">
              {currentSparePart ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default SpareParts;
