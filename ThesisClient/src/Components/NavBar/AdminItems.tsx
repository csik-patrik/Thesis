import DropDown from "./DropDown";
import NavItem from "./NavItem";
export default function AdminItems() {
  return (
    <>
      <DropDown title="Orders">
        <NavItem title="Mobile Orders" to="/mobile-orders" />
        <NavItem title="Computer Orders" to="/computer-orders" />
      </DropDown>
      <DropDown title="Production">
        <NavItem title="Computers" to="/computers/deployed" />
        <NavItem title="Mobiles" to="/mobiles/deployed" />
      </DropDown>
      <DropDown title="Inventory">
        <NavItem title="Computers" to="/computers" />
        <NavItem title="Mobiles" to="/mobiles" />
        <NavItem title="Sim Cards" to="/sim-cards" />
      </DropDown>
      <DropDown title="Admin">
        <NavItem title="Computer categories" to="/admin/computers/categories" />
        <NavItem
          title="Mobile Categories"
          to="/admin/mobile-device-categories"
        />
        <NavItem title="Users" to="/admin/users" />
      </DropDown>
    </>
  );
}
