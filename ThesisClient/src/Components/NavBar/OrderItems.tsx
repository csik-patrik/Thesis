import DropDown from "./DropDown";
import NavItem from "./NavItem";

export default function OrderItems() {
  return (
    <>
      <DropDown title="Mobiles">
        <NavItem title="Create mobile order" to="/mobile-orders/create" />
        <NavItem title="My mobile orders" to="/mobile-orders/my-orders" />
      </DropDown>
      <DropDown title="Computers">
        <NavItem title="Create computer order" to="/computer-orders/create" />
        <NavItem title="My computer orders" to="/computer-orders/my-orders" />
      </DropDown>
    </>
  );
}
