"use client";

import type { ComponentProps, ReactElement } from "react";
import {
  FaArrowRight,
  FaBalanceScale,
  FaBars,
  FaBullseye,
  FaChalkboardTeacher,
  FaComments,
  FaCompass,
  FaDownload,
  FaEnvelope,
  FaHandshake,
  FaHandHoldingHeart,
  FaInstagram,
  FaLeaf,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPlus,
  FaRegCommentDots,
  FaSearchPlus,
  FaShoppingCart,
  FaCartPlus,
  FaSun,
  FaRoute,
  FaUser,
  FaUserCheck,
  FaUserTimes,
  FaUsers,
  FaTools,
  FaRegStar,
} from "react-icons/fa";

export type IconName =
  | "leaf"
  | "sun"
  | "spark"
  | "people"
  | "one"
  | "download"
  | "mail"
  | "arrow"
  | "instagram"
  | "linkedin"
  | "pin"
  | "tools"
  | "plus"
  | "cart"
  | "add"
  | "zoom"
  | "talk"
  | "workshop"
  | "compass"
  | "message"
  | "handshake"
  | "route"
  | "focus"
  | "balance"
  | "care"
  | "menu"
  | "user-check"
  | "user-times";

type IconProps = ComponentProps<"svg"> & {
  name: IconName;
};

const icons: Record<IconName, (props: ComponentProps<"svg">) => ReactElement> = {
  leaf: (props) => <FaLeaf {...props} />,
  sun: (props) => <FaSun {...props} />,
  spark: (props) => <FaRegStar {...props} />,
  people: (props) => <FaUsers {...props} />,
  one: (props) => <FaUser {...props} />,
  download: (props) => <FaDownload {...props} />,
  mail: (props) => <FaEnvelope {...props} />,
  arrow: (props) => <FaArrowRight {...props} />,
  instagram: (props) => <FaInstagram {...props} />,
  linkedin: (props) => <FaLinkedin {...props} />,
  pin: (props) => <FaMapMarkerAlt {...props} />,
  tools: (props) => <FaTools {...props} />,
  plus: (props) => <FaPlus {...props} />,
  cart: (props) => <FaShoppingCart {...props} />,
  add: (props) => <FaCartPlus {...props} />,
  zoom: (props) => <FaSearchPlus {...props} />,
  talk: (props) => <FaComments {...props} />,
  workshop: (props) => <FaChalkboardTeacher {...props} />,
  compass: (props) => <FaCompass {...props} />,
  message: (props) => <FaRegCommentDots {...props} />,
  handshake: (props) => <FaHandshake {...props} />,
  route: (props) => <FaRoute {...props} />,
  focus: (props) => <FaBullseye {...props} />,
  balance: (props) => <FaBalanceScale {...props} />,
  care: (props) => <FaHandHoldingHeart {...props} />,
  menu: (props) => <FaBars {...props} />,
  "user-check": (props) => <FaUserCheck {...props} />,
  "user-times": (props) => <FaUserTimes {...props} />,
};

export default function Icon({ name, ...props }: IconProps) {
  const Component = icons[name];
  return <Component {...props} />;
}
