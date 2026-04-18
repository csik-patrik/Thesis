import { useEffect, useState } from "react";
import type {
  ComputerCategoryResponse,
  CreateComputerRequest,
} from "../../Types/ComputerTypes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { GetComputerCategories } from "../../Services/ComputerOrderServices";
import { toast } from "react-toastify";
import { CreateComputersBulk } from "../../Services/ComputerServices";
import Form from "../Form/Form";
import Input from "../Form/Input";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import Select from "../Form/Select";

export default function ComputersCreateBulk() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [computerCategories, setComputerCategories] = useState<
    ComputerCategoryResponse[]
  >([]);

  const [deviceCount, setDeviceCount] = useState<number>(1);

  const [devices, setDevices] = useState<CreateComputerRequest[]>([]);

  useEffect(() => {
    if (!user || !user.token) return;
    const fetchComputerCategories = async () => {
      try {
        const res = await GetComputerCategories(user);
        setComputerCategories(res.data);
      } catch (err) {
        toast.error("Failed to load computer categories!");
        console.error("Failed to fetch device categories:", err);
      }
    };

    fetchComputerCategories();
  }, [user]);

  useEffect(() => {
    setDevices(
      Array.from({ length: deviceCount }, () => ({
        hostname: "",
        computerCategoryId: 0,
        model: "",
        serialNumber: "",
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
              [name]: name === "computerCategoryId" ? Number(value) : value,
            }
          : dev,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.token) return;

    try {
      await CreateComputersBulk(devices, user);

      toast.success("Computers created successfully!");
      navigate("/computers");
    } catch (err) {
      console.error("Error creating computers:", err);
      toast.error("Failed to create computers.");
    }
  };

  return (
    <Form
      title="Create computers"
      handleSubmit={handleSubmit}
      returnUri="/computers"
      fullWidth
    >
      <Input
        title="Number of devices"
        fieldName="deviceCount"
        type="number"
        value={deviceCount}
        handleChange={(e) => setDeviceCount(Number(e.target.value))}
        placeHolder="Hostname"
        required
      />
      <Table>
        <Thead
          headers={["#", "Hostname", "Category", "Model", "Serial number"]}
        />
        <tbody>
          {devices.map((dev, idx) => (
            <Tr key={idx}>
              <Td>{idx + 1}</Td>
              <Td>
                <Input
                  fieldName="hostname"
                  type="text"
                  value={dev.hostname}
                  handleChange={(e) => handleDeviceChange(idx, e)}
                  placeHolder=""
                  required
                />
              </Td>
              <Td>
                <Select
                  fieldName="computerCategoryId"
                  handleChange={(e) => handleDeviceChange(idx, e)}
                  options={computerCategories.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  value={dev.computerCategoryId}
                ></Select>
              </Td>
              <Td>
                <Input
                  fieldName="model"
                  type="text"
                  value={dev.model}
                  handleChange={(e) => handleDeviceChange(idx, e)}
                  placeHolder=""
                  required
                />
              </Td>
              <Td>
                <Input
                  fieldName="serialNumber"
                  type="text"
                  value={dev.serialNumber}
                  handleChange={(e) => handleDeviceChange(idx, e)}
                  placeHolder=""
                  required
                />
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Form>
  );
}
