import DropDown from "./DropDown";
import NavItem from "./NavItem";

export default function ApproverItems({ mobile = false }: { mobile?: boolean }) {
  return (
    <DropDown title="Approvals" mobile={mobile}>
      <NavItem title="Computer orders" to="/computer-orders/approval" mobile={mobile} />
      <NavItem title="Mobile orders" to="/mobile-orders/approval" mobile={mobile} />
    </DropDown>
  );
}
