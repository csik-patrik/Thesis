import DropDown from "./DropDown";
import NavItem from "./NavItem";

export default function OrderItems({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      <DropDown title="Mobiles" mobile={mobile}>
        <NavItem title="Create mobile order" to="/mobile-orders/create" mobile={mobile} />
        <NavItem title="My mobile orders" to="/mobile-orders/my-orders" mobile={mobile} />
      </DropDown>
      <DropDown title="Computers" mobile={mobile}>
        <NavItem title="Create computer order" to="/computer-orders/create" mobile={mobile} />
        <NavItem title="My computer orders" to="/computer-orders/my-orders" mobile={mobile} />
      </DropDown>
    </>
  );
}
