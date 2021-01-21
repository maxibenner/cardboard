import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../../media/logo-dark.svg";
import * as ROUTES from "../../constants/routes";
import styles from "./styles.module.css";
import { FirebaseContext } from "../../context/firebase";
import { BiBookHeart } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import { MdSettings, MdGroup } from "react-icons/md";

import UserContext from "../userContext";
import ButtonLight from "../buttonLight";
import DropdownFull from "../dropdownFull";
import ArrowText from "../arrow-text";

export default function Navbar(props) {
	const { firebase } = useContext(FirebaseContext);

	const logout = () => {
		firebase.auth().signOut();
	};

	return (
		<div
			className={`${styles.nav} ${props.relative && styles.relative} ${
				props.yellow && styles.yellow
			}`}
		>
			<div className={styles.container}>
				<Link to={props.to}>
					<img className={styles.logo} src={Logo} alt="CardboardLogo" />
				</Link>

				<div className={styles.menuContainer}>
					{!props.noauth && (
						<>
							<div className={styles.navMenuWide}>
								<Link as={Link} to={ROUTES.LIBRARY}>
									<ButtonLight title={"Library"} />
								</Link>
								<Link as={Link} to={"#"}>
									<ButtonLight
										title={"Shared"}
										onClick={() => window.alert("Coming soon.")}
									/>
								</Link>
								<DropdownFull down icon={<UserContext />}>
									<Link as={Link} to={ROUTES.SETTINGS}>
										<ButtonLight title={"Settings"} icon={<MdSettings />} />
									</Link>
									<ButtonLight
										title={"Logout"}
										onClick={logout}
										icon={<HiOutlineLogout />}
									/>
								</DropdownFull>
							</div>

							<div className={styles.navMenuNarrow}>
								<DropdownFull down icon={<UserContext />}>
									<Link as={Link} to={ROUTES.LIBRARY}>
										<ButtonLight title={"Library"} icon={<BiBookHeart />} />
									</Link>
									<Link as={Link} to={"#"}>
										<ButtonLight
											title={"Shared"}
											onClick={() => window.alert("Coming soon.")}
											icon={<MdGroup />}
										/>
									</Link>
									<Link as={Link} to={ROUTES.SETTINGS}>
										<ButtonLight title={"Settings"} icon={<MdSettings />} />
									</Link>
									<ButtonLight
										title={"Logout"}
										onClick={logout}
										icon={<HiOutlineLogout />}
									/>
								</DropdownFull>
							</div>
						</>
					)}
					{props.login && (
						<div className={styles.navMenu}>
							<Link to={ROUTES.SIGN_IN}>
								<ArrowText text="Login" />
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
