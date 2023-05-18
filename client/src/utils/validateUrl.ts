export function validateUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.protocol === "https:" &&
      urlObj.hostname === "play.google.com" &&
      urlObj.searchParams.has("id")
    );
  } catch (_) {
    return false;
  }
}
