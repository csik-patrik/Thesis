import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { MobileDeviceCategory } from '../../Types/MobileDeviceCategory';
import axios from 'axios';
import Input from '../Form/Input';
import { toast } from 'react-toastify';
import Spinner from '../Shared/Spinner';
import Form from '../Form/Form';

interface CreateMobileDeviceCategory {
  name: string;
}

export default function EditMobileDeviceCategory() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<MobileDeviceCategory | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<CreateMobileDeviceCategory>({
    name: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get<MobileDeviceCategory>(
          `${API_URL}/admin/mobile-device-categories/${id}`,
        );
        setCategory(res.data);
        setFormData({
          name: res.data.name,
        });
      } catch (err) {
        console.error('Error fetching sim card:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

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

    try {
      await axios.put(
        `${API_URL}/admin/mobile-device-categories/${id}`,
        JSON.stringify(formData.name),
        { headers: { 'Content-Type': 'application/json' } },
      );
      toast.success('Category updated successfully!');
      navigate('/admin/mobile-device-categories');
    } catch (err) {
      console.error('Failed to update category:', err);
      alert('Failed to update category.');
    }
  };

  if (loading) return <Spinner />;

  if (!category)
    return <p className="text-center text-danger mt-5">Category not found.</p>;

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
