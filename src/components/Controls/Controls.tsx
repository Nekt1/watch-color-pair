import clsx from "clsx";
import ColorMatchContainer from "./ColorMatchContainer/ColorMatchContainer";
import MatchBtn from "./MatchBtn/MatchBtn";
import ResetBtn from "./ResetBtn/ResetBtn";
import styles from "./controls.module.scss";
import ColorModeToggle from "./ColorModeToggle/ColorModeToggle";
import type { Color, DualColor, LabValue } from "../../types";
import ComplementaryModeToggle from "./ComplementaryModeToggle/ComplementaryModeToggle";
import ManualModeToggle from "./ManualModeToggle/ManualModeToggle";

interface ControlsProps {
	topMatches: Color[] | DualColor[] | null;
	imageLoaded: boolean;
	color: LabValue | null;
	colorMode: boolean;
	resetMatches: () => void;
	checkMatch: () => void;
	changeMode: () => void;
	setIsManualMode: () => void;
	isManualMode: boolean;
	setIsComplementaryMode: () => void;
	isComplementaryMode: boolean;
}

export default function Controls({
	topMatches,
	imageLoaded,
	color,
	colorMode,
	resetMatches,
	checkMatch,
	changeMode,
	setIsManualMode,
	isManualMode,
	setIsComplementaryMode,
	isComplementaryMode,
}: ControlsProps) {
	const isColorSelected = color !== null;
	const isResetBtnDisabled = !imageLoaded && topMatches == null;
	return (
		<div
			className={clsx(styles.controlsContainer, {
				[styles.found]: topMatches,
			})}
		>
			<div className={styles.buttons}>
				<div className={styles.buttonsContainer}>
					<ResetBtn onClick={resetMatches} isDisabled={isResetBtnDisabled}>
						<div>Reset</div>
					</ResetBtn>
					<MatchBtn onClick={checkMatch} isDisabled={!isColorSelected}>
						<div>Find a match</div>
					</MatchBtn>
				</div>
				<div className={styles.togglesContainer}>
					<ColorModeToggle colorMode={colorMode} changeMode={changeMode} />
					<ManualModeToggle
						manualMode={isManualMode}
						changeMode={setIsManualMode}
					/>
					<ComplementaryModeToggle
						complementaryMode={isComplementaryMode}
						changeMode={setIsComplementaryMode}
					/>
				</div>
			</div>
			<ColorMatchContainer color={color} topMatches={topMatches} />
		</div>
	);
}
