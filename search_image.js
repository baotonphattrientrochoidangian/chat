async function getGoogleImageLinksManual(searchQuery) {
    try {
        console.log('Starting image search for:', searchQuery);
        const encodedQuery = encodeURIComponent(searchQuery);
        const googleUrl = `https://www.google.com/search?q=${encodedQuery}&tbm=isch&num=10`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(googleUrl)}`;

        console.log('Fetching from proxy:', proxyUrl);
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            console.error('Proxy request failed:', response.status, response.statusText);
            return [];
        }

        const html = await response.text();
        const imageLinks = new Set();
        let startIndex = 0;
        while ((startIndex = html.indexOf('<img', startIndex)) !== -1) {
            const endIndex = html.indexOf('>', startIndex);
            if (endIndex !== -1) {
                const imgTag = html.substring(startIndex, endIndex + 1);
                let srcIndex = imgTag.indexOf('src="');
                if (srcIndex === -1) {
                    srcIndex = imgTag.indexOf("src='");
                    if (srcIndex !== -1) {
                        const startQuote = srcIndex + 5;
                        const endQuote = imgTag.indexOf("'", startQuote);
                        if (endQuote !== -1) {
                            const src = imgTag.substring(startQuote, endQuote);
                            if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:image')) {
                                imageLinks.add(src);
                            }
                        }
                    }
                } else {
                    const startQuote = srcIndex + 5;
                    const endQuote = imgTag.indexOf('"', startQuote);
                    if (endQuote !== -1) {
                        const src = imgTag.substring(startQuote, endQuote);
                        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:image')) {
                            imageLinks.add(src);
                        }
                    }
                }
                startIndex = endIndex + 1;
            } else {
                break; // Malformed HTML, stop processing
            }
        }

        console.log('Found image links manually:', Array.from(imageLinks));
        return Array.from(imageLinks);

    } catch (error) {
        console.error('Image search failed:', error);
        return [];
    }
}

getGoogleImageLinksManual("Ô ăn quan")