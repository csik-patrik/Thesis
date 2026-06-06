import DropDown from "./DropDown";
import NavItem from "./NavItem";

export default function AdminItems({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      <DropDown title="Orders" mobile={mobile}>
        <NavItem title="Mobile Orders" to="/mobile-orders" mobile={mobile} />
        <NavItem title="Computer Orders" to="/computer-orders" mobile={mobile} />
      </DropDown>
      <DropDown title="Production" mobile={mobile}>
        <NavItem title="Computers" to="/computers/deployed" mobile={mobile} />
        <NavItem title="Mobiles" to="/mobiles/deployed" mobile={mobile} />
      </DropDown>
      <DropDown title="Inventory" mobile={mobile}>
        <NavItem title="Computers" to="/computers" mobile={mobile} />
        <NavItem title="Mobiles" to="/mobiles" mobile={mobile} />
        <NavItem title="Sim Cards" to="/sim-cards" mobile={mobile} />
      </DropDown>
      <DropDown title="Admin" mobile={mobile}>
        <NavItem title="Computer categories" to="/admin/computers/categories" mobile={mobile} />
        <NavItem title="Mobile Categories" to="/admin/mobile-device-categories" mobile={mobile} />
        <NavItem title="Users" to="/admin/users" mobile={mobile} />
      </DropDown>
    </>
  );
}
