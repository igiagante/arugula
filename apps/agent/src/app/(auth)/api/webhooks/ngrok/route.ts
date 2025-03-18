export async function POST(request: Request) {
  const body = await request.json();
  console.log("Webhook received:", body);
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
