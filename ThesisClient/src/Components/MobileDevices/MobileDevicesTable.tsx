import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";
import Button from "../Shared/Button";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";
import {
  DeleteMobileDevice,
  GetMobileDevices,
} from "../../Services/MobileServices";
import Spinner from "../Shared/Spinner";
import CustomLink2 from "../Shared/CustomLink2";
import StatusBadge from "../Shared/StatusBadge";

export default function MobileDevicesTable() {
  const { user } = useAuth();
  const [mobileDevices, setMobileDevices] = useState<MobileDeviceResponse[]>(
    [],
  );
  const [selectedMobileDeviceId, setSelectedMobileDeviceId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusReasonFilter, setStatusReasonFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const dialog = useRef<ModalHandle>(null);
  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchDevices = async () => {
      try {
        const res = await GetMobileDevices(user);
        setMobileDevices(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!user || !user.token) return;

    try {
      await DeleteMobileDevice(id, user);

      setMobileDevices((prev) => prev.filter((item) => item.id !== id));

      toast.success("Mobile deleted successfully!");
    } catch (err) {
      console.error("Error deleting mobile device:", err);
      alert("Failed to delete sim card.");
    }
  };

  function showModal(id: number) {
    setSelectedMobileDeviceId(id);
    dialog.current?.open();
  }

  const categories = Array.from(
    new Set(mobileDevices.map((device) => device.mobileDeviceCategory.name)),
  );
  const statusReasons = Array.from(
    new Set(mobileDevices.map((device) => device.statusReason)),
  );

  const filteredData = mobileDevices.filter((device) => {
    const categoryMatch = categoryFilter
      ? device.mobileDeviceCategory.name === categoryFilter
      : true;
    const reasonMatch = statusReasonFilter
      ? device.statusReason === statusReasonFilter
      : true;
    return categoryMatch && reasonMatch;
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Modal
        ref={dialog}
        title="Do you want to delete the selected mobile device?"
        buttonText="Delete"
        buttonColor="red"
        handleSubmit={() => handleDelete(selectedMobileDeviceId)}
      />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Mobile devices in inventory
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage mobile devices
              </p>
            </div>
            <div className="flex gap-2">
              <CustomLink2 to="/mobiles/create" label="Create" />
              <CustomLink2 to="/mobiles/create-bulk" label="Create bulk" />
            </div>
          </div>
          {/* ── Empty state ── */}
          {mobileDevices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4"></div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No mobile devices yet!
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                There aren't any mobile devices in the database yet! Create your
                first one!
              </p>
              <CustomLink2 to="/mobiles/create" label="Create a new mobile" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-5">
                {["All", ...categories].map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-3 py-1.5 text-sm rounded-xl font-medium transition-colors ${
                      categoryFilter === category
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                    <span
                      className={`ml-1.5 text-xs ${categoryFilter === category ? "text-teal-200" : "text-gray-400"}`}
                    >
                      {category === "All"
                        ? mobileDevices.length
                        : mobileDevices.filter(
                            (m) => m.mobileDeviceCategory.name === category,
                          ).length}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {["All", ...statusReasons].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusReasonFilter(status)}
                    className={`px-3 py-1.5 text-sm rounded-xl font-medium transition-colors ${
                      statusReasonFilter === status
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {status}
                    <span
                      className={`ml-1.5 text-xs ${statusReasonFilter === status ? "text-teal-200" : "text-gray-400"}`}
                    >
                      {status === "All"
                        ? mobileDevices.length
                        : mobileDevices.filter((m) => m.statusReason === status)
                            .length}
                    </span>
                  </button>
                ))}
              </div>

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
                          "Status",
                          "Status reason",
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
                          <td className="px-5 py-3.5">
                            <StatusBadge status={d.status} />
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={d.statusReason} />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Button
                                color="red"
                                handleClick={() => showModal(d.id)}
                                label="Delete"
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
                    No mobile device match the selected filter.
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
