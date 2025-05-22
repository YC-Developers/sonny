import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sparePartApi, stockInApi, stockOutApi } from '../services/api';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSpareParts: 0,
    totalStockIn: 0,
    totalStockOut: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data in parallel
        const [spareParts, stockInRecords, stockOutRecords] = await Promise.all([
          sparePartApi.getAll(),
          stockInApi.getAll(),
          stockOutApi.getAll()
        ]);

        setStats({
          totalSpareParts: spareParts.data.length,
          totalStockIn: stockInRecords.data.length,
          totalStockOut: stockOutRecords.data.length
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-500 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Spare Parts</h2>
          <p className="text-3xl font-bold text-blue-500">{stats.totalSpareParts}</p>
          <Link to="/spare-parts" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
            View all spare parts →
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Stock In Records</h2>
          <p className="text-3xl font-bold text-green-500">{stats.totalStockIn}</p>
          <Link to="/stock-in" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
            View all stock in records →
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Stock Out Records</h2>
          <p className="text-3xl font-bold text-red-500">{stats.totalStockOut}</p>
          <Link to="/stock-out" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
            View all stock out records →
          </Link>
        </div>
      </div>


    </Layout>
  );
};

export default Dashboard;
