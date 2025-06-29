import { useRef, useState } from "react";
import styles from "./main.module.scss";
import "./reset.css";
import type { Color, DualColor, LabValue } from "./types.ts";
import Controls from "./components/Controls/Controls.tsx";
import UploadContainer from "./components/UploadContainer/UploadContainer.tsx";
import {
	deltaFilter,
	dualColorFilter,
	singleColorFilter,
} from "./utils/colorFilters.ts";
import type { ImageCanvasRef } from "./components/UploadContainer/ImageCanvas/ImageCanvas.tsx";

// main TODO
// add the remaining dual colors (pain)
// work on accessibility
// add watch face selection instead of just single / dual color mode? (cuz thanks appel for this system)
// add an option to take a photo from mobile instead of uploading a file - seems like it works out of the box, need to check androidos
// change color palette (ugh)
// add an option for color select without needing to upload something
// add complementary colors? can just convert to hsl and then flip it
// some weird twitching when the colorHeader is first loaded? need to investigate
// check localStorage saving the mode (so it doesn't always refresh to single)
// toggle button - adjust size and check on mobile, not smoothy smooth
// check font sizes / weights - inconsistent
// disabling zoom on mobile - check for a better solution, not this cringe
// hover state gets stuck on buttons on mobile - need to investigate & fix

function App() {
	const [color, setColor] = useState<LabValue | null>(null);
	const [topMatches, setTopMatches] = useState<Color[] | DualColor[] | null>(
		null,
	);
	const [imageLoaded, setImageLoaded] = useState<boolean>(false);
	const [singleColorMode, setSingleColorMode] = useState<boolean>(true);
	const canvasRef = useRef<ImageCanvasRef>(null);

	function checkMatch(updatedMode?: boolean) {
		if (!color) return;
		const modeValue = updatedMode !== undefined ? updatedMode : singleColorMode;
		let deltas: Color[] | DualColor[];
		if (modeValue) {
			deltas = singleColorFilter(color);
		} else {
			deltas = dualColorFilter(color);
		}
		deltas.sort(deltaFilter);
		const bestMatches = deltas.slice(0, 5);
		setTopMatches(bestMatches);
	}

	function resetPicture() {
		if (!canvasRef.current) return;
		setImageLoaded(false);
		setTopMatches(null);
		setColor(null);
		canvasRef.current.clearCanvas();
		canvasRef.current.resetImage();
	}

	function changeMode() {
		const newMode = !singleColorMode;
		setSingleColorMode(newMode);
		if (topMatches) {
			checkMatch(newMode);
		}
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
					/>
					<Controls
						topMatches={topMatches}
						resetPicture={resetPicture}
						imageLoaded={imageLoaded}
						checkMatch={() => checkMatch()}
						color={color}
						colorMode={singleColorMode}
						changeMode={changeMode}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
