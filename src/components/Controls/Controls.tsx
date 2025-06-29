import clsx from "clsx";
import ColorMatchContainer from "./ColorMatchContainer/ColorMatchContainer";
import MatchBtn from "./MatchBtn/MatchBtn";
import ResetBtn from "./ResetBtn/ResetBtn";
import styles from "./controls.module.scss";
import ColorModeToggle from "./ColorModeToggle/ColorModeToggle";
import type { Color, DualColor, LabValue } from "../../types";

interface ControlsProps {
	topMatches: Color[] | DualColor[] | null;
	imageLoaded: boolean;
	color: LabValue | null;
	colorMode: boolean;
	resetPicture: () => void;
	checkMatch: () => void;
	changeMode: () => void;
}

export default function Controls({
	topMatches,
	imageLoaded,
	color,
	colorMode,
	resetPicture,
	checkMatch,
	changeMode,
}: ControlsProps) {
	const isColorSelected = color !== null;
	return (
		<div
			className={clsx(styles.controls, {
				[styles.found]: topMatches,
			})}
		>
			<div className={styles.buttonContainer}>
				<ResetBtn onClick={resetPicture} isDisabled={imageLoaded}>
					<div>Reset the picture</div>
				</ResetBtn>
				<MatchBtn onClick={checkMatch} isDisabled={isColorSelected}>
					<div>Find a match</div>
				</MatchBtn>
				<ColorModeToggle colorMode={colorMode} changeMode={changeMode} />
			</div>
			<ColorMatchContainer color={color} topMatches={topMatches} />
		</div>
	);
}
