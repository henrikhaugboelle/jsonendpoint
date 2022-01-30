declare const JSONSTORAGE: KVNamespace;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const send = (response: unknown = {}, status = 200) => {
  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

async function handleEvent(event: FetchEvent): Promise<Response> {
  try {
    const request = event.request;
    const url = new URL(request.url);
    const key = url.pathname;

    if (request.method === 'GET') {
      const value = await JSONSTORAGE.get(key, { type: 'json' });
      if (value === null) return send({ message: 'Not Found' }, 404);
      return send(value);
    } else if (request.method === 'POST' || request.method === 'PUT') {
      const payload = await request.json();
      const value = JSON.stringify(payload);
      await JSONSTORAGE.put(key, value);
      return send();
    } else if (request.method === 'DELETE') {
      await JSONSTORAGE.delete(key);
      return send();
    } else if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: { ...corsHeaders, 'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || '', },
        status: 204,
      });
    }
  } catch (error) {
    console.error(error);
  }
  
  return send({ message: 'Bad Request' }, 400);
}

addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event));
});
