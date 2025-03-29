
export async function GET(request: Request) {
    // Read the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
  
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header missing' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    // Extract the token (assuming it follows the Bearer token format)
    const token = authHeader.split(' ')[1];
  
    if (!token) {
      return new Response(JSON.stringify({ error: 'Token missing' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    // Here you would typically verify the token and possibly fetch user data
    // For demonstration, we will just return a message with the token
    return Response.json({ message: 'Hello World', token });
  }