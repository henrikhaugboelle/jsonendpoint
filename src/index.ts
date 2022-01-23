declare const JSONSTORAGE: KVNamespace;

const send = (response: unknown = {}, status = 200) => {
  return new Response(JSON.stringify(response), {
    headers: { 'content-type': 'application/json' },
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
    }
  } catch (error) {
    console.error(error);
  }
  
  return send({ message: 'Bad Request' }, 400);
}

addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event));
});
