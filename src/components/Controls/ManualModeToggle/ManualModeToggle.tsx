import Toggle from "../../Toggle/Toggle";
import styles from "./manualModeToggle.module.scss";

interface ManualModeToggleProps {
	manualMode: boolean;
	changeMode: () => void;
}

export default function ManualModeToggle({
	manualMode,
	changeMode,
}: ManualModeToggleProps) {
	return (
		<div className={styles.manualModeToggleContainer}>
			<p>Manual mode</p>
			<Toggle
				name={"manualModeToggle"}
				firstLabel="on"
				secondLabel="off"
				handleChange={changeMode}
				isDisabled={manualMode}
			/>
		</div>
	);
}
