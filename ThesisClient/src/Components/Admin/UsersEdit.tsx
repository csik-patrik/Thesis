import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  UpdateUserRequest,
  UserResponse,
  UserRoleResponse,
} from '../../Types/UserTypes';
import { useAuth } from '../../Auth/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Form from '../Form/Form';
import Input from '../Form/Input';
import SelectMultiple from '../Form/SelectMultiple';

export default function UsersEdit() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [userRoles, setUserRoles] = useState<UserRoleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    id: 0,
    username: '',
    displayName: '',
    email: '',
    department: '',
    costCenter: '',
    userRoleIds: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        if (!user || !user.token) return;
        const res = await axios.get<UserResponse>(
          `http://localhost:5000/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        setFormData({
          id: res.data.id,
          username: res.data.username || '',
          displayName: res.data.displayName || '',
          email: res.data.email || '',
          department: res.data.department || '',
          costCenter: res.data.costCenter || '',
          userRoleIds: res.data.userRoles?.map((r) => r.id) || [],
        });
      } catch (err) {
        toast.error('Error fetching user data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id, user]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get<UserRoleResponse[]>(
          'http://localhost:5000/roles',
        );
        setUserRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Failed to load roles.');
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: any } },
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
      if (!user || !user.token) {
        toast.error('Authentication required.');
        return;
      }

      await axios.put('http://localhost:5000/users/', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      toast.success('User updated successfully!');
      navigate('/admin/users');
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user.');
    }
  };

  if (isLoading) {
    return <h1>User is loading...</h1>;
  }

  if (formData.username == '') {
    return <h1>User not found.</h1>;
  }

  return (
    <Form
      title="Edit user data"
      handleSubmit={handleSubmit}
      returnUri="/admin/users"
    >
      <Input
        title="Username:"
        fieldName="username"
        placeHolder=""
        type="text"
        value={formData.username}
        handleChange={handleChange}
      />
      <Input
        title="Displayname:"
        fieldName="displayName"
        placeHolder=""
        type="text"
        value={formData.displayName}
        handleChange={handleChange}
      />
      <Input
        title="Email address:"
        fieldName="email"
        placeHolder="patrik.csik@bosch.com"
        type="text"
        value={formData.email}
        handleChange={handleChange}
      />
      <Input
        title="Department:"
        fieldName="department"
        placeHolder="BD/SLE-EET3"
        type="text"
        value={formData.department}
        handleChange={handleChange}
      />
      <Input
        title="Cost center:"
        fieldName="costCenter"
        placeHolder="658091"
        type="text"
        value={formData.costCenter}
        handleChange={handleChange}
      />
      <SelectMultiple
        title="Roles:"
        fieldName="userRoleIds"
        value={formData.userRoleIds}
        options={userRoles.map((r) => ({
          label: r.name,
          value: r.id,
        }))}
        handleChange={handleChange}
      />
    </Form>
  );
}
