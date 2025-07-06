import Toggle from "../../Toggle/Toggle";
import styles from "./colorModeToggle.module.scss";

interface ColorModeToggleProps {
	colorMode: boolean;
	changeMode: () => void;
}

export default function ColorModeToggle({
	colorMode,
	changeMode,
}: ColorModeToggleProps) {
	return (
		<div className={styles.colorModeToggleContainer}>
			<p>Color Match</p>
			<Toggle
				isDisabled={colorMode}
				handleChange={changeMode}
				name={"colorModeToggle"}
				firstLabel={"single"}
				secondLabel="dual"
			/>
		</div>
	);
}
