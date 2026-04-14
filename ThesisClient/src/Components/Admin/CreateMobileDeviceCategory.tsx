import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Form from '../Form/Form';
import Input from '../Form/Input';
import type { CreateMobileDeviceCategoryRequest } from '../../Types/MobileTypes';
import { useAuth } from '../../Auth/AuthContext';

export default function CreateMobileDeviceCategory() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateMobileDeviceCategoryRequest>({
    name: '',
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.token) return;
    try {
      await axios.post(
        `${API_URL}/mobile-device-categories`,
        { name: formData.name },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      toast.success('Category created successfully!');
      navigate('/admin/mobile-device-categories');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create category.');
    }
  };

  return (
    <Form
      title="Create mobile device category"
      handleSubmit={handleSubmit}
      returnUri="/admin/mobile-device-categories"
    >
      <Input
        title="Name:"
        fieldName="name"
        placeHolder="Feature phone"
        type="text"
        value={formData.name}
        handleChange={handleChange}
      />
      <Link
        to="/admin/mobile-device-categories"
        className="btn btn-primary me-2"
      >
        Back
      </Link>
    </Form>
  );
}
