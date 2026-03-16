import { FaMobile } from "react-icons/fa6";
import TableLayout from "../../Layouts/TableLayout";
import type { SimCardResponse } from "../../Types/MobileTypes";
import EmptyState from "../Shared/Table/EmptyState";
import Table from "../Shared/Table/Table";
import Td from "../Shared/Table/Td";
import Tr from "../Shared/Table/Tr";

export default function AllocateSimCard({
  simCards,
  simSearch,
  setSimSearch,
}: {
  simCards: SimCardResponse[];
  simSearch: string;
  setSimSearch: (text: string) => void;
}) {
  return (
    <TableLayout title="Allocate SIM card" subtitle="Select a SIM card for this order">
      {simCards.length === 0 ? (
        <EmptyState
          icon={<FaMobile />}
          title="There aren't any sim cards available"
          description=""
        />
      ) : (
        <Table>
          <Tr key="search">
            <Td>
              <input
                type="text"
                placeholder="Search by phone number..."
                value={simSearch}
                onChange={(e) => setSimSearch(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </Td>
          </Tr>
          <Tr>
            <Td>Hello world</Td>
          </Tr>
        </Table>
      )}
    </TableLayout>
  );
}

//                   <div className="rounded-lg bg-white p-3 shadow space-y-2">
//                     {filteredSimCards.length === 0 ? (
//                       <p className="text-neutral-500">No sim cards available for allocation.</p>
//                     ) : (
//                       <ul className="space-y-2">
//                         {filteredSimCards.map((sim) => (
//                           <li
//                             key={sim.id}
//                             className="flex flex-col rounded border border-neutral-200 p-2"
//                           >
//                             <strong>{sim.phoneNumber}</strong>
//                             <span>Call Control Group: {sim.simCallControlGroup.name}</span>
//                             <span>
//                               Data Enabled: {sim.simCallControlGroup.isDataEnabled ? "Yes" : "No"}
//                             </span>
//                             <span>Status: {sim.status}</span>
//                             <button
//                               disabled={allocatingSim === sim.id}
//                               onClick={() => handleAllocateSim(sim.id)}
//                               className="
//                               mt-2 self-end rounded-md bg-green-600 px-3 py-1 text-white text-sm
//                               hover:bg-green-500 transition disabled:opacity-60 disabled:cursor-not-allowed
//                             "
//                             >
//                               {allocatingSim === sim.id ? "Allocating..." : "Allocate"}
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
