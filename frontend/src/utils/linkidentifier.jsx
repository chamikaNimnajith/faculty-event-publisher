export const renderTextWithLinks = (text) => {
    // Improved regex without capturing groups for splitting
    const urlRegex = /\b(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d+)?(?:\/[^\s]*)?\b/g;

    const result = [];
    let lastIndex = 0;
    let match;

    // Use exec to find all matches and their positions
    while ((match = urlRegex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            result.push(text.substring(lastIndex, match.index));
        }

        // Process the URL
        const url = match[0];
        const formattedLink = url.startsWith("http") ? url : `http://${url}`;

        result.push(
            <a
                key={match.index}
                href={formattedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
            >
                {url}
            </a>
        );

        lastIndex = urlRegex.lastIndex;
    }

    // Add remaining text after last match
    if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
    }

    return result;
};
