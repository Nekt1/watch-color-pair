export function loadImage(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				resolve(img);
			};
			if (e.target?.result) {
				img.src = e.target.result as string;
			} else {
				reject(new Error("FileReader result is null or undefined"));
			}
		};
		fileReader.readAsDataURL(file);
		fileReader.onerror = reject;
	});
}
