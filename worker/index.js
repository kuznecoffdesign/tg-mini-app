export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const missingUrl = new URL(request.url);
    missingUrl.pathname = "/404.html";
    missingUrl.search = "";
    const missing = await env.ASSETS.fetch(new Request(missingUrl, request));
    return new Response(request.method === 'HEAD' ? null : missing.body, { status: 404, headers: missing.headers });
  },
};
