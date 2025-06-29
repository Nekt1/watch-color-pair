import type { ButtonProps } from "../../../types";
import Button from "../../Button/Button";
import styles from "./matchBtn.module.scss";

export default function MatchBtn({
	onClick,
	isDisabled,
	children,
}: ButtonProps) {
	return (
		<div className={styles.matchButtonContainer}>
			<Button onClick={onClick} isDisabled={isDisabled}>
				{children}
			</Button>
		</div>
	);
}
