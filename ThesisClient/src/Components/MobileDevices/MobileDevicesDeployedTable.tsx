import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import axios from "axios";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";
import Spinner from "../Shared/Spinner";
import { Link } from "react-router-dom";
import Button from "../Shared/Button";

export default function MobileDevicesDeployedTable() {
  const { user } = useAuth();

  const [mobiles, setMobiles] = useState<MobileDeviceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchDevices = async () => {
      try {
        const res = await axios.get<MobileDeviceResponse[]>(
          "http://localhost:5268/mobile-devices/deployed",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );

        setMobiles(res.data);
      } catch (err) {
        console.error("Error loading mobile devices:", err);

        toast.error("Failed to load mobile devices.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [user]);

  const filteredData = mobiles.filter((device) => {
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

      setMobiles((prev) => prev.filter((mobile) => mobile.id !== deviceId));

      const res = await axios.get<MobileDeviceResponse[]>(
        "http://localhost:5268/mobile-devices/deployed",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      setMobiles(res.data);
    } catch (err) {
      console.error("Return error:", err);
      toast.error("Failed to return device.");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Deployed mobile devices
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track and manage deployed mobile devices
              </p>
            </div>
          </div>
          {/* ── Empty state ── */}
          {mobiles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-teal-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No orders yet
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                You haven't submitted any mobile device requests. Create your
                first one to get started.
              </p>
              <Link
                to="/mobile-orders/create"
                className="px-5 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm"
              >
                Create your first order
              </Link>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search by hostname"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-auto focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70">
                        {[
                          "Id",
                          "Hostname",
                          "Category",
                          "IMEI number",
                          "Serial number",
                          "User",
                          "Phone number",
                          "Call control group",
                          "Data enabled",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((d) => (
                        <tr
                          key={d.id}
                          className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">
                            {d.id}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">
                            {d.hostname}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.mobileDeviceCategory.name}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.imeiNumber}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.serialNumber}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.user?.displayName || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.simCard.phoneNumber}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.simCard.simCallControlGroup.name}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.simCard?.simCallControlGroup.isDataEnabled
                              ? "True"
                              : "False"}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Button
                                color="yellow"
                                handleClick={() => showModal(d.id)}
                                label="Return"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredData.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-400">
                    No orders match the selected filter.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
