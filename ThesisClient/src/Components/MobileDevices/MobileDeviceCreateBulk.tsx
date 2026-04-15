import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CreateMobileDevicesBulk,
  GetMobileDeviceCategories,
} from '../../Services/MobileDeviceServices';
import type {
  CreateMobileDeviceRequest,
  MobileDeviceCategoryResponse,
} from '../../Types/MobileTypes';
import { useAuth } from '../../Auth/AuthContext';

export default function MobileDeviceCreateBulk() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [mobileDeviceCategories, setMobileDeviceCategories] = useState<
    MobileDeviceCategoryResponse[]
  >([]);

  const [deviceCount, setDeviceCount] = useState<number>(1);

  const [devices, setDevices] = useState<CreateMobileDeviceRequest[]>([]);

  useEffect(() => {
    if (!user?.token) return;
    GetMobileDeviceCategories(user)
      .then((response) => setMobileDeviceCategories(response.data))
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  useEffect(() => {
    setDevices(
      Array.from({ length: deviceCount }, () => ({
        hostname: '',
        mobileDeviceCategoryId: 0,
        imeiNumber: '',
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
              [name]: name === 'mobileDeviceCategoryId' ? Number(value) : value,
            }
          : dev,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error('You must be logged in to create a device.');
      return;
    }

    try {
      await CreateMobileDevicesBulk(devices, user);

      toast.success('Mobile devices created successfully!');
      navigate('/mobiles');
    } catch (err) {
      console.error('Error creating mobile devices:', err);
      toast.error('Failed to create mobile devices.');
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg px-6 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Bulk Create Mobile Devices
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-2">
            <label htmlFor="deviceCount" className="text-sm font-medium">
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
              className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-3 py-2 text-left">#</th>
                  <th className="border px-3 py-2 text-left">Hostname</th>
                  <th className="border px-3 py-2 text-left">Category</th>
                  <th className="border px-3 py-2 text-left">IMEI Number</th>
                  <th className="border px-3 py-2 text-left">Serial Number</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((dev, idx) => (
                  <tr key={idx} className="even:bg-gray-50">
                    <td className="border px-3 py-2">{idx + 1}</td>
                    <td className="border px-3 py-2">
                      <input
                        type="text"
                        name="hostname"
                        placeholder="HTV-M-00001"
                        value={dev.hostname}
                        onChange={(e) => handleDeviceChange(idx, e)}
                        required
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <select
                        name="mobileDeviceCategoryId"
                        value={dev.mobileDeviceCategoryId}
                        onChange={(e) => handleDeviceChange(idx, e)}
                        required
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value={0} disabled>
                          Select category...
                        </option>
                        {mobileDeviceCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="text"
                        name="imeiNumber"
                        placeholder="3525..."
                        value={dev.imeiNumber}
                        onChange={(e) => handleDeviceChange(idx, e)}
                        required
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="text"
                        name="serialNumber"
                        placeholder="SFZ213"
                        value={dev.serialNumber}
                        onChange={(e) => handleDeviceChange(idx, e)}
                        required
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/mobiles"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Back
            </Link>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
