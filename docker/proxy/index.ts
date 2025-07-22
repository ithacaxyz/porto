Bun.serve({
  async fetch(request) {
    const headers = new Headers({
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Max-Age": "86400",
    });
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers,
        status: 204,
      });
    }

    if (request.method === "GET") return new Response("Nada");

    const body = await request.json();
    const target =
      body.method &&
      (body.method.startsWith("wallet_") ||
        body.method === "health" ||
        body.method.startsWith("account_"))
        ? Bun.env.RELAY_URL!
        : Bun.env.ANVIL_URL!;
    const res = await fetch(target, {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (
      body.method &&
      ![
        "eth_getBlockByNumber",
        "eth_getBalance",
        "eth_feeHistory",
        "eth_blockNumber",
        "web3_clientVersion",
      ].includes(body.method)
    ) {
      const resClone = res.clone();
      console.log("request: ", body, "response: ", await resClone.json());
    }

    headers.set("content-type", "application/json");

    return new Response(res.body, {
      headers,
    });
  },
  port: Number(Bun.env.PORT!),
});
