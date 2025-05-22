import { useState, useEffect, useRef } from 'react';
import { reportApi } from '../services/api';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('stock-status');
  const [stockStatus, setStockStatus] = useState([]);
  const [dailyStockOut, setDailyStockOut] = useState({ items: [], total: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printableReportRef = useRef(null);

  const fetchStockStatus = async () => {
    try {
      setLoading(true);
      const response = await reportApi.getStockStatus();
      setStockStatus(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stock status:', err);
      setError('Failed to load stock status report');
      setLoading(false);
    }
  };

  const fetchDailyStockOut = async (date) => {
    try {
      setLoading(true);
      const response = await reportApi.getDailyStockOut(date);
      setDailyStockOut(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching daily stock out:', err);
      setError('Failed to load daily stock out report');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'stock-status') {
      fetchStockStatus();
    } else if (activeTab === 'daily-stock-out') {
      fetchDailyStockOut(selectedDate);
    }
  }, [activeTab, selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const stockStatusColumns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'total_stock_in', label: 'Total Stock In' },
    { key: 'total_stock_out', label: 'Total Stock Out' },
    { key: 'current_quantity', label: 'Current Quantity' }
  ];

  const dailyStockOutColumns = [
    { key: 'spare_part_name', label: 'Spare Part' },
    { key: 'category', label: 'Category' },
    { key: 'stock_out_quantity', label: 'Quantity' },
    {
      key: 'stock_out_unit_price',
      label: 'Unit Price',
      render: (row) => `$${parseFloat(row.stock_out_unit_price).toFixed(2)}`
    },
    {
      key: 'stock_out_total_price',
      label: 'Total Price',
      render: (row) => `$${parseFloat(row.stock_out_total_price).toFixed(2)}`
    }
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button
          onClick={handlePrintReport}
          variant="primary"
        >
          Print Report
        </Button>
      </div>

      <div className="mb-6 print:hidden">
        <div className="flex border-b border-gray-700">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'stock-status'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('stock-status')}
          >
            Stock Status
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'daily-stock-out'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('daily-stock-out')}
          >
            Daily Stock Out
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {activeTab === 'daily-stock-out' && (
        <div className="mb-6 print:hidden">
          <div className="flex items-end space-x-4">
            <div className="w-64">
              <Input
                label="Select Date"
                id="date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <Button
              onClick={() => fetchDailyStockOut(selectedDate)}
              className="mb-4"
            >
              Generate Report
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64 print:hidden">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div ref={printableReportRef} className="print:p-4">
          {activeTab === 'stock-status' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 print:text-center print:text-2xl">Stock Status Report</h2>
              <div className="print:border print:border-gray-300 print:rounded">
                <Table
                  columns={stockStatusColumns}
                  data={stockStatus}
                />
              </div>
            </div>
          )}

          {activeTab === 'daily-stock-out' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 print:text-center print:text-2xl">
                Daily Stock Out Report - {new Date(selectedDate).toLocaleDateString()}
              </h2>

              <div className="print:border print:border-gray-300 print:rounded">
                <Table
                  columns={dailyStockOutColumns}
                  data={dailyStockOut.items}
                />
              </div>

              {dailyStockOut.items.length > 0 && (
                <div className="mt-4 text-right">
                  <p className="text-lg font-semibold">
                    Total: ${parseFloat(dailyStockOut.total).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="hidden print:block mt-16 h-32 border-t pt-4">
                <div className="flex justify-between mt-16">
                  <div>
                    <p>Authorized Signature: ________________________</p>
                  </div>
                  <div>
                    <p>Date: ________________</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Reports;
