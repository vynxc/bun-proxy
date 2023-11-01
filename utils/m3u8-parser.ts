export class M3U8Parser {
    public static readonly listOfPlaylistKeywords: string[] = ["#EXT-X-STREAM-INF", "#EXT-X-I-FRAME-STREAM-INF"];

    public static fixAllUrlsToAbsolute(lines: string[], url: string, prefix: string, suffix: string): string {
        const parameters = M3U8Parser.getParamsRegex().exec(url)?.[0] ?? "";
        const uri = new URL(url);
        const uriPattern = /URI="([^"]+)"/;

        for (let i = 0; i < lines.length; i++) {
            const isUri = lines[i].includes("URI");
            if (!isUri && (lines[i].startsWith("#") || lines[i].trim() === "")) continue;

            const uriContent = isUri ? uriPattern.exec(lines[i])?.[1] ?? "" : lines[i];
            const uriExtracted = new URL(uriContent, uri);
            const newUri = !uriExtracted.protocol ? new URL(uriExtracted.href, uri) : uriExtracted;
            const substitutedUri = `${prefix}${encodeURIComponent(newUri.href + parameters)}${suffix}`;
            const test = isUri ? lines[i].replace(uriPattern, `URI="${substitutedUri}"`) : substitutedUri;
            lines[i] = test;
        }

        return lines.join("\n");
    }

    public static isPlaylistM3U8(lines: string[]): boolean {
        let isPlaylistM3U8 = false;
        const maxIterations = Math.min(lines.length, 10);

        for (let i = 0; i < maxIterations; i++) {
            for (let j = 0; j < this.listOfPlaylistKeywords.length; j++) {
                if (lines[i].toLowerCase().indexOf(this.listOfPlaylistKeywords[j].toLowerCase()) < 0) continue;
                isPlaylistM3U8 = true;
                break;
            }

            if (isPlaylistM3U8) break;
        }
        return isPlaylistM3U8;
    }

    private static getParamsRegex(): RegExp {
        return /\?.+/;
    }
}
