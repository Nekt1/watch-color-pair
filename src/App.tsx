import { useRef, useState } from "react";
import styles from "./main.module.scss";
import "./reset.scss";
import type { Color, DualColor, LabValue } from "./types.ts";
import Controls from "./components/Controls/Controls.tsx";
import UploadContainer from "./components/UploadContainer/UploadContainer.tsx";
import {
	deltaFilter,
	dualColorFilter,
	singleColorFilter,
} from "./utils/colorFilters.ts";
import type { ImageCanvasRef } from "./components/UploadContainer/ImageCanvas/ImageCanvas.tsx";
import { getComplementaryColor } from "./utils/colorConversions.ts";

// remaining TODOs
// add the remaining dual colors in data
// improve accessibility (toggle selectors, aria stuff, etc)
// implement localStorage saving the state
// add watch face types? will need to adjust data and map to corresponding watch types, but will be more useful instead of just dual / single modes
// reset matches on change to complementary mode, need to adjust checkMatch parameters 

function App() {
	const [color, setColor] = useState<LabValue | null>(null);
	const [topMatches, setTopMatches] = useState<Color[] | DualColor[] | null>(
		null,
	);
	const [imageLoaded, setImageLoaded] = useState<boolean>(false);
	const [singleColorMode, setSingleColorMode] = useState<boolean>(true);
	const [isComplementaryMode, setIsComplementaryMode] =
		useState<boolean>(false);
	const [isManualMode, setIsManualMode] = useState<boolean>(false);
	const canvasRef = useRef<ImageCanvasRef>(null);

	// need to split, does too much
	function checkMatch(updatedColorMode?: boolean) {
		if (!color) return;
		const targetColor = isComplementaryMode
			? getComplementaryColor(color)
			: color;
		const modeValue =
			updatedColorMode !== undefined ? updatedColorMode : singleColorMode;
		let deltas: Color[] | DualColor[];
		if (modeValue) {
			deltas = singleColorFilter(targetColor);
		} else {
			deltas = dualColorFilter(targetColor);
		}
		deltas.sort(deltaFilter);
		const bestMatches = deltas.slice(0, 5);
		setTopMatches(bestMatches);
	}

	function clearCanvas() {
		if (!canvasRef.current) return;
		canvasRef.current.clearCanvas();
		canvasRef.current.resetImage();
	}

	function resetMatches() {
		setImageLoaded(false);
		setTopMatches(null);
		setColor(null);
		clearCanvas();
	}

	function changeMode() {
		const newMode = !singleColorMode;
		setSingleColorMode(newMode);
		if (topMatches) {
			checkMatch(newMode);
		}
	}

	function setManualColor(lab: LabValue) {
		setColor(lab);
	}

	function setManualMode() {
		setIsManualMode(!isManualMode);
		resetMatches();
	}

	function setComplementaryMode() {
		setIsComplementaryMode(!isComplementaryMode);
		resetMatches();
	}

	return (
		<div className={styles.mainContainer}>
			<div className={styles.containerOuter}>
				<div className={styles.containerInner}>
					<UploadContainer
						imageLoaded={imageLoaded}
						setImageLoaded={setImageLoaded}
						setColor={setColor}
						ref={canvasRef}
						isManualMode={isManualMode}
						setManualColor={setManualColor}
					/>
					<Controls
						topMatches={topMatches}
						resetMatches={resetMatches}
						imageLoaded={imageLoaded}
						checkMatch={() => checkMatch()}
						color={color}
						colorMode={singleColorMode}
						changeMode={changeMode}
						setIsManualMode={setManualMode}
						isManualMode={isManualMode}
						setIsComplementaryMode={setComplementaryMode}
						isComplementaryMode={isComplementaryMode}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
