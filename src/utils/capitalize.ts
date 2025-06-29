export function capitalize(str: string): string {
	const capitalizedWords: string[] = [];
	const allWords = str.split(" ");
	allWords.forEach((word) => {
		capitalizedWords.push(word[0].toUpperCase() + word.slice(1));
	});

	return capitalizedWords.join(" ");
}
