/** Public assets shipped with the site — no ad-hoc placeholder swatches. */
export function isProjectProductImage(src: string | undefined | null): src is string {
  return Boolean(src?.startsWith("/images/"));
}

export function filterProjectImages(urls: string[]): string[] {
  return urls.filter(isProjectProductImage);
}
