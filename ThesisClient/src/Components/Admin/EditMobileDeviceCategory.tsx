import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { MobileDeviceCategory } from '../../Types/MobileDeviceCategory';
import Input from '../Form/Input';
import { toast } from 'react-toastify';
import Spinner from '../Shared/Spinner';
import Form from '../Form/Form';
import {
  GetMobileDeviceCategoryById,
  UpdateMobileDeviceCategory,
} from '../../Services/MobileDeviceServices';
import { useAuth } from '../../Auth/AuthContext';

interface CreateMobileDeviceCategory {
  name: string;
}

export default function EditMobileDeviceCategory() {
  const { user } = useAuth();

  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<MobileDeviceCategory | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<CreateMobileDeviceCategory>({
    name: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) return;
    const GetMobileDeviceCategory = async () => {
      try {
        const res = await GetMobileDeviceCategoryById(Number(id), user);

        setCategory(res.data);

        setFormData({
          name: res.data.name,
        });
      } catch (err) {
        toast.error('Failed to load mobile device category!');
        console.error('Failed to load mobile device cateogory:', err);
      } finally {
        setLoading(false);
      }
    };
    GetMobileDeviceCategory();
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
    if (!user || !user.token) return;
    try {
      await UpdateMobileDeviceCategory(Number(id), formData.name, user);
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
