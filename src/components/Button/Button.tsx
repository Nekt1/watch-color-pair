import clsx from "clsx";
import styles from "./button.module.scss";
import type { ButtonProps } from "../../types";

export default function Button({ onClick, isDisabled, children }: ButtonProps) {
	return (
		<button
			className={clsx(styles.defaultButton, {
				[styles.disabled]: !isDisabled,
			})}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
