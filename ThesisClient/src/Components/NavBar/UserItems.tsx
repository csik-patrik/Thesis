import DropDown from "./DropDown";
import NavItem from "./NavItem";

export default function UserItems({
  displayname,
  mobile = false,
}: {
  displayname: string;
  mobile?: boolean;
}) {
  return (
    <DropDown title={`👤 ${displayname ?? "User"}`} mobile={mobile}>
      <NavItem title="My Computers" to="/computers/my-computers" mobile={mobile} />
      <NavItem title="My Mobiles" to="/mobiles/my-mobiles" mobile={mobile} />
    </DropDown>
  );
}
