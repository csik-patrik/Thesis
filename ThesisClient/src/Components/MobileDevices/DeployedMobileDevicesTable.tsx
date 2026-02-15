import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import axios from "axios";
import Table from "../Shared/Table";
import Button from "../Shared/Button";

export default function DeployedMobileDevicesTable() {
  const { user } = useAuth();
  const [data, setData] = useState<MobileDeviceResponse[]>([]);

  const [search, setSearch] = useState<string>("");

  // const [showReturnModal, setShowReturnModal] = useState(false);
  // const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  // const [returnData, setReturnData] = useState({
  //   status: "In inventory",
  //   statusReason: "In inventory",
  // });

  useEffect(() => {
    if (!user?.token) {
      toast.error("You must be logged in to view this page.");
      return;
    }
    axios
      .get<MobileDeviceResponse[]>(
        "http://localhost:5268/mobile-devices/deployed",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        console.log("Fetched devices:", res.data);

        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, [user]);

  function handleReturn() {
    console.log("Not implemented");
  }

  // const handleReturn = async (
  //   deviceId: number,
  //   status: string,
  //   statusReason: string,
  // ) => {
  //   if (!user?.token) {
  //     toast.error("Unauthorized — please log in again.");
  //     return;
  //   }

  //   try {
  //     await axios.put(
  //       `http://localhost:5268/mobile-devices/return/${deviceId}`,
  //       { status, statusReason },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       },
  //     );

  //     toast.success(`Device marked as "${status}" successfully!`);

  //     setData((prev) => prev.filter((d) => d.id !== deviceId));

  //     const res = await axios.get<MobileDeviceResponse[]>(
  //       "http://localhost:5268/mobile-devices/deployed",
  //       {
  //         headers: { Authorization: `Bearer ${user.token}` },
  //       },
  //     );

  //     setData(res.data);
  //   } catch (err) {
  //     console.error("Return error:", err);
  //     toast.error("Failed to return device.");
  //   }
  // };

  const filteredData = data.filter((device) => {
    const searchMatch = device.hostname
      .toLowerCase()
      .includes(search.toLowerCase()); // Filter by hostname
    return searchMatch;
  });

  // {
  //   showReturnModal && (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  //       <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
  //         <div className="flex justify-between items-center px-4 py-3 border-b">
  //           <h5 className="text-lg font-semibold">Return Device</h5>
  //           <button
  //             className="text-gray-500 hover:text-gray-700"
  //             onClick={() => setShowReturnModal(false)}
  //           >
  //             ✕
  //           </button>
  //         </div>
  //         <div className="px-4 py-4">
  //           <div className="mb-4">
  //             <label className="block font-semibold mb-1">Status</label>
  //             <select
  //               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
  //               value={returnData.status}
  //               onChange={(e) =>
  //                 setReturnData((prev) => ({
  //                   ...prev,
  //                   status: e.target.value,
  //                 }))
  //               }
  //             >
  //               <option>In inventory</option>
  //             </select>
  //           </div>

  //           <div className="mb-4">
  //             <label className="block font-semibold mb-1">
  //               Status Reason
  //             </label>
  //             <select
  //               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
  //               value={returnData.statusReason}
  //               onChange={(e) =>
  //                 setReturnData((prev) => ({
  //                   ...prev,
  //                   statusReason: e.target.value,
  //                 }))
  //               }
  //             >
  //               <option>In inventory</option>
  //               <option>In repair</option>
  //               <option>Pending disposal</option>
  //             </select>
  //           </div>
  //         </div>

  //         <div className="flex justify-end gap-2 px-4 py-3 border-t">
  //           <button
  //             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
  //             onClick={() => setShowReturnModal(false)}
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
  //             onClick={() => {
  //               if (selectedDeviceId) {
  //                 handleReturn(
  //                   selectedDeviceId,
  //                   returnData.status,
  //                   returnData.statusReason,
  //                 );
  //               }
  //               setShowReturnModal(false);
  //             }}
  //           >
  //             Confirm Return
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
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
          {filteredData.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 border-b">{d.id}</td>
              <td className="px-3 py-2 border-b">{d.hostname}</td>
              <td className="px-3 py-2 border-b">
                {d.mobileDeviceCategory.name}
              </td>
              <td className="px-3 py-2 border-b">{d.imeiNumber}</td>
              <td className="px-3 py-2 border-b">{d.serialNumber}</td>
              <td className="px-3 py-2 border-b">{d.user?.userName || "—"}</td>
              <td className="px-3 py-2 border-b">
                {d.simCard?.phoneNumber || "—"}
              </td>
              <td className="px-3 py-2 border-b">
                {d.simCard?.simCallControlGroup.name || "—"}
              </td>
              <td className="px-3 py-2 border-b">
                {d.simCard?.simCallControlGroup.isDataEnabled
                  ? "True"
                  : "False"}
              </td>
              <td className="px-3 py-2 border-b">
                <Button
                  color="yellow"
                  handleClick={handleReturn}
                  label="Return"
                />
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
