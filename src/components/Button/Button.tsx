import clsx from "clsx";
import styles from "./button.module.scss";

export interface ButtonProps {
	onClick: () => void;
	isDisabled: boolean;
	children: React.ReactNode;
}

export default function Button({ onClick, isDisabled, children }: ButtonProps) {
	return (
		<button
			className={clsx(styles.btn, {
				[styles.disabled]: isDisabled,
			})}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
