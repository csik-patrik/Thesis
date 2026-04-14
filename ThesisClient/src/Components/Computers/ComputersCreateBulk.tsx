import { useEffect, useState } from 'react';
import type {
  ComputerCategoryResponse,
  CreateComputerRequest,
} from '../../Types/ComputerTypes';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import axios from 'axios';

export default function ComputersCreateBulk() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [computerCategories, setComputerCategories] = useState<
    ComputerCategoryResponse[]
  >([]);

  const [deviceCount, setDeviceCount] = useState<number>(1);

  const [devices, setDevices] = useState<CreateComputerRequest[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.token) return;
    const fetchComputerCategories = async () => {
      try {
        const res = await axios.get<ComputerCategoryResponse[]>(
          `${API_URL}/computer-categories`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setComputerCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch device categories:', err);
      }
    };

    fetchComputerCategories();
  }, [user]);

  useEffect(() => {
    setDevices(
      Array.from({ length: deviceCount }, () => ({
        hostname: '',
        computerCategoryId: 0,
        model: '',
        serialNumber: '',
      })),
    );
  }, [deviceCount]);

  const handleDeviceChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setDevices((prev) =>
      prev.map((dev, i) =>
        i === idx
          ? {
              ...dev,
              [name]: name === 'computerCategoryId' ? Number(value) : value,
            }
          : dev,
      ),
    );
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!user || !user.token) return;

  //   try {
  //     await axios.post(`${API_URL}//computers/bulk`, devices, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     });

  //     toast.success("Computers created successfully!");
  //     navigate("/computers");
  //   } catch (err) {
  //     console.error("Error creating computers:", err);
  //     toast.error("Failed to create computers.");
  //   }
  // };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-6xl bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Bulk create computers
        </h1>

        {/* Number of devices */}
        <div className="mb-6 flex items-center gap-3">
          <label htmlFor="deviceCount" className="font-medium text-gray-700">
            Number of devices:
          </label>
          <input
            type="number"
            id="deviceCount"
            min={1}
            max={100}
            value={deviceCount}
            onChange={(e) => setDeviceCount(Number(e.target.value))}
            required
            className="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Devices table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">#</th>
                <th className="px-4 py-2 text-left text-gray-600">Hostname</th>
                <th className="px-4 py-2 text-left text-gray-600">Category</th>
                <th className="px-4 py-2 text-left text-gray-600">Model</th>
                <th className="px-4 py-2 text-left text-gray-600">
                  Serial Number
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {devices.map((dev, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="hostname"
                      placeholder="HTV-C-00001"
                      value={dev.hostname}
                      onChange={(e) => handleDeviceChange(idx, e)}
                      required
                      className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      name="computerCategoryId"
                      value={dev.computerCategoryId}
                      onChange={(e) => handleDeviceChange(idx, e)}
                      required
                      className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0} disabled>
                        Select category...
                      </option>
                      {computerCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="model"
                      placeholder="Lenovo T14 G2"
                      value={dev.model}
                      onChange={(e) => handleDeviceChange(idx, e)}
                      required
                      className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="serialNumber"
                      placeholder="SFZ213"
                      value={dev.serialNumber}
                      onChange={(e) => handleDeviceChange(idx, e)}
                      required
                      className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to="/computers"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Back
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
