import DropDown from "./DropDown";
import NavItem from "./NavItem";

export default function UserItems({displayname}: {displayname: string}) {
  return (
    <DropDown title={`👤 ${displayname ?? "User"}`}>
      <NavItem title="My Computers" to="/computers/my-computers" />
      <NavItem title="My Mobiles" to="/mobiles/my-mobiles" />
    </DropDown>
  );
}
