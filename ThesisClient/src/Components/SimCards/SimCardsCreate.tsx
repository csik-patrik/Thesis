import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "../Form/Form";
import Input from "../Form/Input";
import Select from "../Form/Select";
import { toast } from "react-toastify";
import type {
  CreateSimCardRequest,
  SimCallControlGroupResponse,
} from "../../Types/MobileTypes";
import { GetSimCallControlGroups } from "../../Services/MobileDeviceServices";

function SimCardsCreate() {
  const [simCallControlGroups, setSimCallControlGroups] = useState<
    SimCallControlGroupResponse[]
  >([]);

  useEffect(() => {
    GetSimCallControlGroups()
      .then((response) => setSimCallControlGroups(response.data))
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const [formData, setFormData] = useState<CreateSimCardRequest>({
    phoneNumber: "",
    simCallControlGroupId: 0,
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "isDataEnabled"
          ? value === "true" // convert dropdown string -> boolean
          : name === "simCallControlGroupId"
            ? Number(value) // convert select id string -> number
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5268/sim-cards", formData);
      toast.success("Sim card created successfully!");
      navigate("/sim-cards");
    } catch (err) {
      console.error("Error creating sim card:", err);
      toast.error("Failed to create sim card.");
      alert("Failed to create sim card.");
    }
  };

  return (
    <Form
      title="Create a new Sim Card"
      handleSubmit={handleSubmit}
      returnUri="/sim-cards"
    >
      {/* Phone Number Input */}
      <Input
        title="Phone number:"
        fieldName="phoneNumber"
        placeHolder="+36208288073"
        type="text"
        value={formData.phoneNumber}
        handleChange={handleChange}
      />

      {/* Call Control Group Select */}
      <Select
        title="Call control group:"
        fieldName="simCallControlGroupId"
        value={formData.simCallControlGroupId}
        options={simCallControlGroups.map((g) => ({
          label: g.name,
          value: String(g.id),
        }))}
        handleChange={handleChange}
      />

      {/* Back Button */}
      <div className="mt-4 flex gap-3">
        <Link
          to="/sim-cards"
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
    </Form>
  );
}

export default SimCardsCreate;
