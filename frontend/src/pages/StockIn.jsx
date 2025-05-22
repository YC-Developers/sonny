import { useState, useEffect } from 'react';
import { stockInApi, sparePartApi } from '../services/api';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';

const StockIn = () => {
  const [stockInRecords, setStockInRecords] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    spare_part_id: '',
    stock_in_quantity: '',
    stock_in_date: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stockInResponse, sparePartsResponse] = await Promise.all([
        stockInApi.getAll(),
        sparePartApi.getAll()
      ]);
      setStockInRecords(stockInResponse.data);
      setSpareParts(sparePartsResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      spare_part_id: '',
      stock_in_quantity: '',
      stock_in_date: new Date().toISOString().split('T')[0]
    });
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
    if (!formData.spare_part_id) {
      errors.spare_part_id = 'Spare part is required';
    }
    if (!formData.stock_in_quantity) {
      errors.stock_in_quantity = 'Quantity is required';
    } else if (isNaN(formData.stock_in_quantity) || parseInt(formData.stock_in_quantity) <= 0) {
      errors.stock_in_quantity = 'Quantity must be a positive number';
    }
    if (!formData.stock_in_date) {
      errors.stock_in_date = 'Date is required';
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
      // Create new stock in record
      await stockInApi.create({
        ...formData,
        stock_in_quantity: parseInt(formData.stock_in_quantity)
      });
      
      fetchData();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving stock in record:', err);
      setError('Failed to save stock in record');
    }
  };

  const columns = [
    { 
      key: 'spare_part_name', 
      label: 'Spare Part'
    },
    { 
      key: 'category', 
      label: 'Category'
    },
    { 
      key: 'stock_in_quantity', 
      label: 'Quantity'
    },
    { 
      key: 'stock_in_date', 
      label: 'Date',
      render: (row) => new Date(row.stock_in_date).toLocaleDateString()
    }
  ];

  const sparePartOptions = spareParts.map(part => ({
    value: part.id.toString(),
    label: `${part.name} (${part.category})`
  }));

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock In Records</h1>
        <Button onClick={handleOpenModal}>Add New Stock In</Button>
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
          data={stockInRecords}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Stock In"
      >
        <form onSubmit={handleSubmit}>
          <Select
            label="Spare Part"
            id="spare_part_id"
            name="spare_part_id"
            value={formData.spare_part_id}
            onChange={handleChange}
            options={sparePartOptions}
            error={formErrors.spare_part_id}
          />
          <Input
            label="Quantity"
            id="stock_in_quantity"
            name="stock_in_quantity"
            type="number"
            value={formData.stock_in_quantity}
            onChange={handleChange}
            error={formErrors.stock_in_quantity}
          />
          <Input
            label="Date"
            id="stock_in_date"
            name="stock_in_date"
            type="date"
            value={formData.stock_in_date}
            onChange={handleChange}
            error={formErrors.stock_in_date}
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
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default StockIn;
