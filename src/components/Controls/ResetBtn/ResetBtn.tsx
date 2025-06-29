import type { ButtonProps } from "../../../types";
import Button from "../../Button/Button";
import styles from "./resetBtn.module.scss";

export default function ResetBtn({
	isDisabled,
	onClick,
	children,
}: ButtonProps) {
	return (
		<div className={styles.resetButtonContainer}>
			<Button isDisabled={isDisabled} onClick={onClick}>
				{children}
			</Button>
		</div>
	);
}
