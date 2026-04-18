import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { useEffect, useState } from "react";
import type {
  CreateSimCardRequest,
  SimCallControlGroupResponse,
} from "../../Types/MobileTypes";
import {
  CreateSimCardsBulk,
  GetSimCallControlGroups,
} from "../../Services/SimCardServices";
import { toast } from "react-toastify";
import Form from "../Form/Form";
import Input from "../Form/Input";
import Select from "../Form/Select";
import Table from "../Shared/Table/Table";
import Td from "../Shared/Table/Td";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";

export default function SimCardsCreateBulk() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [simCallControlGroups, setSimCallControlGroups] = useState<
    SimCallControlGroupResponse[]
  >([]);

  const [deviceCount, setDeviceCount] = useState<number>(1);

  const [devices, setDevices] = useState<CreateSimCardRequest[]>([]);

  useEffect(() => {
    if (!user || !user.token) return;
    const fetchSimCallControlGroups = async () => {
      try {
        const res = await GetSimCallControlGroups(user);
        setSimCallControlGroups(res.data);
      } catch (err) {
        toast.error("Failed to load sim call control groups!");
        console.error("Failed to fetch sim call control groups:", err);
      }
    };

    fetchSimCallControlGroups();
  }, [user]);

  useEffect(() => {
    setDevices(
      Array.from({ length: deviceCount }, () => ({
        phoneNumber: "",
        simCallControlGroupId: 0,
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
              [name]: name === "simCallControlGroupId" ? Number(value) : value,
            }
          : dev,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.token) return;

    try {
      await CreateSimCardsBulk(devices, user);

      toast.success("Sim cards created successfully!");
      navigate("/sim-cards");
    } catch (err) {
      console.error("Error creating sim cards:", err);
      toast.error("Failed to create sim cards.");
    }
  };

  return (
    <Form
      title="Create sim cards"
      handleSubmit={handleSubmit}
      returnUri="/sim-cards"
      fullWidth
    >
      <Input
        title="Number of sim cards"
        fieldName="deviceCount"
        type="number"
        value={deviceCount}
        handleChange={(e) => setDeviceCount(Number(e.target.value))}
        placeHolder=""
        required
      />
      <Table>
        <Thead headers={["#", "Phone number", "Call control group"]} />
        <tbody>
          {devices.map((dev, idx) => (
            <Tr key={idx}>
              <Td>{idx + 1}</Td>
              <Td>
                <Input
                  fieldName="phoneNumber"
                  type="text"
                  value={dev.phoneNumber}
                  handleChange={(e) => handleDeviceChange(idx, e)}
                  placeHolder=""
                  required
                />
              </Td>
              <Td>
                <Select
                  fieldName="simCallControlGroupId"
                  handleChange={(e) => handleDeviceChange(idx, e)}
                  options={simCallControlGroups.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  value={dev.simCallControlGroupId}
                ></Select>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Form>
  );
}
