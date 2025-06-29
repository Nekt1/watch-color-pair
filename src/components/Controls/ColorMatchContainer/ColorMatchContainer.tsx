import clsx from "clsx";
import styles from "./colorMatchContainer.module.scss";
import ColorMatchHeader from "./ColorMatchHeader/ColorMatchHeader";
import ColorMatchOptions from "./ColorMatchOptions/ColorMatchOptions";
import type { Color, DualColor, LabValue } from "../../../types";

interface ColorMatchContainerProps {
	color: LabValue | null;
	topMatches: Color[] | DualColor[] | null;
}

export default function ColorMatchContainer({
	color,
	topMatches,
}: ColorMatchContainerProps) {
	return (
		<div
			className={clsx(styles.colorResults, {
				[styles.active]: color,
			})}
		>
			{color && (
				<>
					<ColorMatchHeader color={color} />
					{topMatches && <ColorMatchOptions topMatches={topMatches} />}
				</>
			)}
		</div>
	);
}
