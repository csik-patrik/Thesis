import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import axios from "axios";
import Table from "../Shared/Table";
import Button from "../Shared/Button";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";

export default function MobileDevicesDeployedTable() {
  const { user } = useAuth();

  const [mobileDevices, setMobileDevices] = useState<MobileDeviceResponse[]>(
    [],
  );
  const [selectedMobileId, setSelectedMobileId] = useState(0);

  const [returnData, setReturnData] = useState({
    status: "In inventory",
    statusReason: "In inventory",
  });

  const returnDialog = useRef<ModalHandle>(null);

  function showModal(id: number) {
    setSelectedMobileId(id);
    returnDialog.current?.open();
  }

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (!user?.token) {
      toast.error("You must be logged in to view this page.");
      return;
    }
    const fetchDevices = async () => {
      try {
        const res = await axios.get<MobileDeviceResponse[]>(
          "http://localhost:5268/mobile-devices/deployed",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        setMobileDevices(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      }
    };
    fetchDevices();
  }, [user]);

  const filteredData = mobileDevices.filter((device) => {
    const searchMatch = device.hostname
      .toLowerCase()
      .includes(search.toLowerCase());
    return searchMatch;
  });

  const handleReturn = async (
    deviceId: number,
    status: string,
    statusReason: string,
  ) => {
    if (!user?.token) {
      toast.error("Unauthorized — please log in again.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5268/mobile-devices/return/${deviceId}`,
        { status, statusReason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      toast.success(`Device returned to "${statusReason}" successfully!`);

      setMobileDevices((prev) =>
        prev.filter((mobile) => mobile.id !== deviceId),
      );

      const res = await axios.get<MobileDeviceResponse[]>(
        "http://localhost:5268/mobile-devices/deployed",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      setMobileDevices(res.data);
    } catch (err) {
      console.error("Return error:", err);
      toast.error("Failed to return device.");
    }
  };

  return (
    <>
      <Modal
        ref={returnDialog}
        title="Return mobile device"
        buttonColor="yellow"
        buttonText="Return"
        handleSubmit={() =>
          handleReturn(
            selectedMobileId,
            returnData.status,
            returnData.statusReason,
          )
        }
      >
        <div className="flex gap-1 flex-col pb-2">
          <label className="block font-semibold mb-1">Status</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={returnData.status}
            onChange={(e) =>
              setReturnData((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
          >
            <option value={"In inventory"}>In inventory</option>
          </select>
          <label className="block font-semibold mb-1">Status reason</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={returnData.statusReason}
            onChange={(e) =>
              setReturnData((prev) => ({
                ...prev,
                statusReason: e.target.value,
              }))
            }
          >
            <option value={"In inventory"}>In inventory</option>
          </select>
        </div>
      </Modal>
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">Deployed Mobile Devices</h1>
        <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex gap-2 mb-4 flex-col">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by hostname"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-auto focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
          <Table
            headerItems={[
              "Id",
              "Hostname",
              "Category",
              "Imei number",
              "Serial number",
              "User",
              "Phone number",
              "Call control group",
              "Data enabled",
              "Actions",
            ]}
          >
            {filteredData.map((mobile) => (
              <tr key={mobile.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border-b">{mobile.id}</td>
                <td className="px-3 py-2 border-b">{mobile.hostname}</td>
                <td className="px-3 py-2 border-b">
                  {mobile.mobileDeviceCategory.name}
                </td>
                <td className="px-3 py-2 border-b">{mobile.imeiNumber}</td>
                <td className="px-3 py-2 border-b">{mobile.serialNumber}</td>
                <td className="px-3 py-2 border-b">
                  {mobile.user?.userName || "—"}
                </td>
                <td className="px-3 py-2 border-b">
                  {mobile.simCard?.phoneNumber || "—"}
                </td>
                <td className="px-3 py-2 border-b">
                  {mobile.simCard?.simCallControlGroup.name || "—"}
                </td>
                <td className="px-3 py-2 border-b">
                  {mobile.simCard?.simCallControlGroup.isDataEnabled
                    ? "True"
                    : "False"}
                </td>
                <td className="px-3 py-2 border-b">
                  <Button
                    color="yellow"
                    handleClick={() => showModal(mobile.id)}
                    label="Return"
                  />
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </>
  );
}
