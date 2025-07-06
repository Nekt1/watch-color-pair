import type { LabValue } from "../../../types";
import { hexToRgb, rgbToLab } from "../../../utils/colorConversions";
import styles from "./manualColorPicker.module.scss";
import { HexColorPicker } from "react-colorful";

interface ManualColorPickerProps {
	setManualColor: (arg: LabValue) => void;
}

export default function ManualColorPicker({
	setManualColor,
}: ManualColorPickerProps) {
	function handleColorChange(color: string) {
		const rgb = hexToRgb(color);
		const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
		setManualColor(lab);
	}

	return (
		<div className={styles.colorPickerContainer}>
			<h2>Pick your color</h2>
			<HexColorPicker onChange={handleColorChange} />
		</div>
	);
}
