import DropDown from "./DropDown";
import NavItem from "./NavItem";

export default function ApproverItems() {
  return (
    <DropDown title="Approvals">
      <NavItem title="Computer orders" to="/computer-orders/approval" />
      <NavItem title="Mobile orders" to="/mobile-orders/approval" />
    </DropDown>
  );
}
