const configuredBase = import.meta.env.BASE_URL || "/";

export const appBase = configuredBase === "/" ? "" : configuredBase.replace(/\/$/, "");

export function publicPath(href) {
  if (!href?.startsWith("/") || href.startsWith("//")) return href;
  return `${appBase}${href}`;
}

export function logicalPath(pathname = "/") {
  const withoutBase = appBase && pathname.startsWith(appBase)
    ? pathname.slice(appBase.length)
    : pathname;
  return withoutBase.replace(/\/$/, "") || "/";
}
