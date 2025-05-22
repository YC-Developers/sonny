import { useState, useEffect, useRef } from 'react';
import { stockOutApi, sparePartApi } from '../services/api';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';

const StockOut = () => {
  const [stockOutRecords, setStockOutRecords] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStockOut, setCurrentStockOut] = useState(null);
  const [formData, setFormData] = useState({
    spare_part_id: '',
    stock_out_quantity: '',
    stock_out_unit_price: '',
    stock_out_date: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState({});
  const [stockWarning, setStockWarning] = useState('');
  const [selectedSparePart, setSelectedSparePart] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stockOutResponse, sparePartsResponse] = await Promise.all([
        stockOutApi.getAll(),
        sparePartApi.getAll()
      ]);
      setStockOutRecords(stockOutResponse.data);
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

  const handleOpenModal = (stockOut = null) => {
    if (stockOut) {
      setCurrentStockOut(stockOut);
      setFormData({
        spare_part_id: stockOut.spare_part_id.toString(),
        stock_out_quantity: stockOut.stock_out_quantity.toString(),
        stock_out_unit_price: stockOut.stock_out_unit_price.toString(),
        stock_out_date: stockOut.stock_out_date
      });
    } else {
      setCurrentStockOut(null);
      setFormData({
        spare_part_id: '',
        stock_out_quantity: '',
        stock_out_unit_price: '',
        stock_out_date: new Date().toISOString().split('T')[0]
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

    // Auto-fill unit price when spare part is selected
    if (name === 'spare_part_id' && value) {
      const selectedPart = spareParts.find(part => part.id.toString() === value);
      if (selectedPart) {
        setSelectedSparePart(selectedPart);
        setFormData(prev => ({
          ...prev,
          stock_out_unit_price: selectedPart.unit_price.toString()
        }));

        // Check if there's a quantity already entered
        if (formData.stock_out_quantity) {
          validateStockQuantity(formData.stock_out_quantity, selectedPart);
        }
      }
    }

    // Validate stock quantity when it changes
    if (name === 'stock_out_quantity' && value && selectedSparePart) {
      validateStockQuantity(value, selectedSparePart);
    }

    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateStockQuantity = (quantity, sparePart) => {
    const requestedQty = parseInt(quantity);
    const availableQty = sparePart.quantity;

    if (isNaN(requestedQty) || requestedQty <= 0) {
      setStockWarning('');
      return;
    }

    if (requestedQty > availableQty) {
      setStockWarning(`Warning: Only ${availableQty} units available`);
    } else if (requestedQty >= availableQty * 0.8) {
      setStockWarning(`Warning: Using ${requestedQty} of ${availableQty} available units`);
    } else {
      setStockWarning('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.spare_part_id) {
      errors.spare_part_id = 'Spare part is required';
    }
    if (!formData.stock_out_quantity) {
      errors.stock_out_quantity = 'Quantity is required';
    } else if (isNaN(formData.stock_out_quantity) || parseInt(formData.stock_out_quantity) <= 0) {
      errors.stock_out_quantity = 'Quantity must be a positive number';
    } else if (selectedSparePart && parseInt(formData.stock_out_quantity) > selectedSparePart.quantity) {
      errors.stock_out_quantity = `Not enough stock available. Only ${selectedSparePart.quantity} units in stock.`;
    }
    if (!formData.stock_out_unit_price) {
      errors.stock_out_unit_price = 'Unit price is required';
    } else if (isNaN(formData.stock_out_unit_price) || parseFloat(formData.stock_out_unit_price) <= 0) {
      errors.stock_out_unit_price = 'Unit price must be a positive number';
    }
    if (!formData.stock_out_date) {
      errors.stock_out_date = 'Date is required';
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
      const processedData = {
        ...formData,
        stock_out_quantity: parseInt(formData.stock_out_quantity),
        stock_out_unit_price: parseFloat(formData.stock_out_unit_price)
      };

      if (currentStockOut) {
        // Update existing stock out record
        await stockOutApi.update(currentStockOut.id, processedData);
      } else {
        // Create new stock out record
        await stockOutApi.create(processedData);
      }

      fetchData();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving stock out record:', err);
      setError(err.response?.data?.message || 'Failed to save stock out record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock out record?')) {
      try {
        await stockOutApi.delete(id);
        fetchData();
      } catch (err) {
        console.error('Error deleting stock out record:', err);
        setError('Failed to delete stock out record');
      }
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
      key: 'stock_out_quantity',
      label: 'Quantity'
    },
    {
      key: 'stock_out_unit_price',
      label: 'Unit Price',
      render: (row) => `$${parseFloat(row.stock_out_unit_price).toFixed(2)}`
    },
    {
      key: 'stock_out_total_price',
      label: 'Total Price',
      render: (row) => `$${parseFloat(row.stock_out_total_price).toFixed(2)}`
    },
    {
      key: 'stock_out_date',
      label: 'Date',
      render: (row) => new Date(row.stock_out_date).toLocaleDateString()
    }
  ];

  const renderActions = (row) => (
    <>
      <Button
        variant="secondary"
        onClick={() => handleOpenModal(row)}
        className="text-xs"
      >
        Edit
      </Button>
      <Button
        variant="danger"
        onClick={() => handleDelete(row.id)}
        className="text-xs"
      >
        Delete
      </Button>
    </>
  );

  const sparePartOptions = spareParts.map(part => ({
    value: part.id.toString(),
    label: `${part.name} (${part.category}) - Qty: ${part.quantity}`
  }));

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Out Records</h1>
        <Button onClick={() => handleOpenModal()}>Add New Stock Out</Button>
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
          data={stockOutRecords}
          actions={renderActions}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentStockOut ? 'Edit Stock Out Record' : 'Add New Stock Out'}
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
            id="stock_out_quantity"
            name="stock_out_quantity"
            type="number"
            value={formData.stock_out_quantity}
            onChange={handleChange}
            error={formErrors.stock_out_quantity}
          />
          {stockWarning && (
            <div className="mt-1 text-orange-500 text-sm font-medium">
              {stockWarning}
            </div>
          )}
          <Input
            label="Unit Price"
            id="stock_out_unit_price"
            name="stock_out_unit_price"
            type="number"
            step="0.01"
            value={formData.stock_out_unit_price}
            onChange={handleChange}
            error={formErrors.stock_out_unit_price}
          />
          <Input
            label="Date"
            id="stock_out_date"
            name="stock_out_date"
            type="date"
            value={formData.stock_out_date}
            onChange={handleChange}
            error={formErrors.stock_out_date}
          />
          <div className="flex justify-end mt-6 space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={selectedSparePart && parseInt(formData.stock_out_quantity) > selectedSparePart.quantity}
              title={selectedSparePart && parseInt(formData.stock_out_quantity) > selectedSparePart.quantity ?
                "Cannot proceed: Requested quantity exceeds available stock" : ""}
            >
              {currentStockOut ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default StockOut;
