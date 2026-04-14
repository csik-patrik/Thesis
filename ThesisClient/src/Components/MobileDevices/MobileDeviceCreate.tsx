import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GetMobileDeviceCategories } from '../../Services/MobileDeviceServices';
import { useAuth } from '../../Auth/AuthContext';
import Form from '../Form/Form';
import Input from '../Form/Input';
import Select from '../Form/Select';

import { mobileDeviceReducer } from './MobileDevice.reducer';
import { mobileDeviceInitialState } from './MobileDevice.initialState';

export default function MobileDeviceCreate() {
  const [state, dispatch] = useReducer(
    mobileDeviceReducer,
    mobileDeviceInitialState,
  );

  const { formData, categories } = state;

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.token) return;
    GetMobileDeviceCategories(user)
      .then((response) => {
        dispatch({
          type: 'SET_CATEGORIES',
          payload: response.data,
        });
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    dispatch({
      type: 'SET_FIELD',
      field: name as keyof typeof formData,
      value: name === 'mobileDeviceCategoryId' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error('You must be logged in to create a device.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/mobile-devices', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      toast.success('Mobile device created successfully!');
      navigate('/mobiles');
    } catch (err) {
      console.error('Error creating mobile device:', err);
      toast.error('Failed to create mobile device.');
    }
  };

  return (
    <Form
      title="Create a new mobile device"
      handleSubmit={handleSubmit}
      returnUri="/mobiles"
    >
      <Input
        title="Hostname"
        fieldName="hostname"
        type="text"
        value={formData.hostname}
        handleChange={handleChange}
        placeHolder="HTV-M-00001"
        required
      />

      <Select
        title="Category"
        fieldName="mobileDeviceCategoryId"
        value={formData.mobileDeviceCategoryId}
        options={categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        handleChange={handleChange}
      />

      <Input
        title="IMEI Number"
        fieldName="imeiNumber"
        type="text"
        value={formData.imeiNumber}
        handleChange={handleChange}
        placeHolder="3525142562"
        required
      />

      <Input
        title="Serial Number"
        fieldName="serialNumber"
        type="text"
        value={formData.serialNumber}
        handleChange={handleChange}
        placeHolder="SFZ213"
        required
      />
    </Form>
  );
}
