import Toggle from "../../Toggle/Toggle";
import styles from "./complementaryModeToggle.module.scss";

interface ComplementaryModeToggleProps {
	complementaryMode: boolean;
	changeMode: () => void;
}

export default function ComplementaryModeToggle({
	complementaryMode,
	changeMode,
}: ComplementaryModeToggleProps) {
	return (
		<div className={styles.complementaryModeToggleContainer}>
			<p>Complementary mode</p>
			<Toggle
				name={"complementaryModeToggle"}
				firstLabel="on"
				secondLabel="off"
				handleChange={changeMode}
				isDisabled={complementaryMode}
			/>
		</div>
	);
}
