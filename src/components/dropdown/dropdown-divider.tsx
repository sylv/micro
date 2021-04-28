import { FunctionComponent } from "react";
import style from "./dropdown.module.css";

export const DropdownDivider: FunctionComponent = () => {
  return <hr className={style.dropdownDivider} />;
};
