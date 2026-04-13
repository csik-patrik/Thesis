import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthContext';
import type { MobileDeviceResponse } from '../../Types/MobileTypes';
import type { ModalHandle } from '../Shared/Modal';
import Modal from '../Shared/Modal';
import Spinner from '../Shared/Spinner';
import Button from '../Shared/Button';
import {
  GetDeployedMobileDevices,
  ReturnMobileDevice,
} from '../../Services/MobileServices';
import TableLayout from '../../Layouts/TableLayout';
import EmptyState from '../Shared/Table/EmptyState';
import { FaMobile } from 'react-icons/fa6';
import Table from '../Shared/Table/Table';
import Thead from '../Shared/Table/Thead';
import Tr from '../Shared/Table/Tr';
import Td from '../Shared/Table/Td';

export default function MobileDevicesDeployedTable() {
  const { user } = useAuth();

  const [mobiles, setMobiles] = useState<MobileDeviceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMobileId, setSelectedMobileId] = useState(0);

  const [returnData, setReturnData] = useState({
    status: 'In inventory',
    statusReason: 'In inventory',
  });

  const returnDialog = useRef<ModalHandle>(null);

  function showModal(id: number) {
    setSelectedMobileId(id);
    returnDialog.current?.open();
  }

  const [search, _setSearch] = useState<string>('');

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchDevices = async () => {
      try {
        const res = await GetDeployedMobileDevices(user);

        setMobiles(res.data);
      } catch (err) {
        console.error('Error loading mobile devices:', err);

        toast.error('Failed to load mobile devices.');
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
      toast.error('Unauthorized — please log in again.');
      return;
    }

    try {
      await ReturnMobileDevice(deviceId, status, statusReason, user);

      toast.success(`Device returned to "${statusReason}" successfully!`);

      setMobiles((prev) => prev.filter((mobile) => mobile.id !== deviceId));
    } catch (err) {
      console.error('Return error:', err);
      toast.error('Failed to return device.');
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
            <option value={'In inventory'}>In inventory</option>
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
            <option value={'In inventory'}>In inventory</option>
          </select>
        </div>
      </Modal>
      <TableLayout
        title="Deployed mobile devices"
        subtitle="Track and manage deployed mobile devices"
      >
        {mobiles.length === 0 ? (
          <EmptyState
            icon={<FaMobile />}
            title="Not found any deployed mobiles"
            description="There aren't any deployed mobiles yet."
          />
        ) : (
          <>
            <Table>
              <Thead
                headers={[
                  'Id',
                  'Hostname',
                  'Category',
                  'IMEI number',
                  'Serial number',
                  'User',
                  'Phone number',
                  'Call control group',
                  'Data enabled',
                  'Actions',
                ]}
              />
              <tbody>
                {filteredData.map((d) => (
                  <Tr key={d.id}>
                    <Td>{d.id}</Td>
                    <Td>{d.hostname}</Td>
                    <Td>{d.mobileDeviceCategory.name}</Td>
                    <Td>{d.imeiNumber}</Td>
                    <Td>{d.serialNumber}</Td>
                    <Td>{d.user.displayName}</Td>
                    <Td>{d.simCard.phoneNumber}</Td>
                    <Td>{d.simCard.simCallControlGroup.name}</Td>
                    <Td>
                      {d.simCard?.simCallControlGroup.isDataEnabled
                        ? 'True'
                        : 'False'}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Button
                          color="yellow"
                          handleClick={() => showModal(d.id)}
                          label="Return"
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
                {filteredData.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-400">
                    No orders match the selected filter.
                  </div>
                )}
              </tbody>
            </Table>
          </>
        )}
      </TableLayout>
    </>
  );
}
