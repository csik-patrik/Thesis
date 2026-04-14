import { useEffect, useState } from 'react';
import type {
  ComputerCategoryResponse,
  CreateComputerRequest,
} from '../../Types/ComputerTypes';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthContext';
import Input from '../Form/Input';
import Select from '../Form/Select';
import Form from '../Form/Form';

export default function ComputersCreate() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { user } = useAuth();

  const [computerCategories, setComputerCategories] = useState<
    ComputerCategoryResponse[]
  >([]);

  const [formData, setFormData] = useState<CreateComputerRequest>({
    hostname: '',
    computerCategoryId: 0,
    model: '',
    serialNumber: '',
  });

  const navigate = useNavigate();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'computerCategoryId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!user || !user.token) return;

    e.preventDefault();

    try {
      await axios.post(`${API_URL}/computers`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      toast.success('Computer created successfully!');
      navigate('/computers');
    } catch (err) {
      console.error('Error creating computer:', err);
      toast.error('Failed to create computer.');
    }
  };

  return (
    <Form
      title="Create a new computer"
      handleSubmit={handleSubmit}
      returnUri="/computers"
    >
      <Input
        title="Hostname"
        fieldName="hostname"
        type="text"
        value={formData.hostname}
        handleChange={handleChange}
        placeHolder="Hostname"
        required
      />
      <Select
        title="Device category"
        fieldName="computerCategoryId"
        value={formData.computerCategoryId}
        options={computerCategories.map((c) => ({
          label: c.name,
          value: c.id,
        }))}
        handleChange={handleChange}
      />
      <Input
        title="Model"
        fieldName="model"
        type="text"
        value={formData.model}
        handleChange={handleChange}
        placeHolder="Model"
        required
      />
      <Input
        title="Serial number"
        fieldName="serialNumber"
        type="text"
        value={formData.serialNumber}
        handleChange={handleChange}
        placeHolder="Serial number"
        required
      />
    </Form>
  );
}
