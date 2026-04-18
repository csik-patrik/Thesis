import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CreateMobileDevicesBulk,
  GetMobileDeviceCategories,
} from "../../Services/MobileDeviceServices";
import type {
  CreateMobileDeviceRequest,
  MobileDeviceCategoryResponse,
} from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";
import Input from "../Form/Input";
import Table from "../Shared/Table/Table";
import Select from "../Form/Select";
import Td from "../Shared/Table/Td";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Form from "../Form/Form";

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
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    setDevices(
      Array.from({ length: deviceCount }, () => ({
        hostname: "",
        mobileDeviceCategoryId: 0,
        imeiNumber: "",
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
              [name]: name === "mobileDeviceCategoryId" ? Number(value) : value,
            }
          : dev,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error("You must be logged in to create a device.");
      return;
    }

    try {
      await CreateMobileDevicesBulk(devices, user);

      toast.success("Mobile devices created successfully!");
      navigate("/mobiles");
    } catch (err) {
      console.error("Error creating mobile devices:", err);
      toast.error("Failed to create mobile devices.");
    }
  };

  return (
    <Form
      title="Create mobile devices"
      handleSubmit={handleSubmit}
      returnUri="/mobiles"
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
          headers={[
            "#",
            "Hostname",
            "Category",
            "IMEI number",
            "Serial number",
          ]}
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
                  fieldName="mobileDeviceCategoryId"
                  handleChange={(e) => handleDeviceChange(idx, e)}
                  options={mobileDeviceCategories.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  value={dev.mobileDeviceCategoryId}
                ></Select>
              </Td>
              <Td>
                <Input
                  fieldName="imeiNumber"
                  type="text"
                  value={dev.imeiNumber}
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
