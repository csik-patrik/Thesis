import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "../Form/Form";
import Input from "../Form/Input";
import Select from "../Form/Select";
import { toast } from "react-toastify";
import type { CreateSimCardRequest } from "../../Types/MobileTypes";

function SimCardsCreate() {
  const [formData, setFormData] = useState<CreateSimCardRequest>({
    phoneNumber: "",
    simCallControlGroupId: 0,
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "isDataEnabled"
          ? value === "true" // convert dropdown string -> boolean
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5268/api/sim-cards", formData);
      toast.success("Sim card created successfully!");
      navigate("/sim-cards");
    } catch (err) {
      console.error("Error creating sim card:", err);
      toast.error("Failed to create sim card.");
      alert("Failed to create sim card.");
    }
  };

  return (
    <>
      <Form title="Create a new Sim Card" handleSubmit={handleSubmit}>
        <Input
          title="Phone number:"
          fieldName="phoneNumber"
          placeHolder="+36208288073"
          type="text"
          value={formData.phoneNumber}
          handleChange={handleChange}
        />
        <Select
          title="Call control group:"
          fieldName="callControlGroup"
          value={formData.simCallControlGroupId}
          options={[
            { label: "SPECIAL F", value: "SPECIAL F" },
            { label: "MIX 10", value: "MIX 10" },
          ]}
          handleChange={handleChange}
        />
        <Link to="/sim-cards" className="btn btn-primary">
          Back
        </Link>
      </Form>
    </>
  );
}

export default SimCardsCreate;
