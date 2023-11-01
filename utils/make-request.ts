export async function makeRequest(url: string, headers: Record<string, string>): Promise<Response | null> {
  
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: headers
    };
  
    try {
      return await fetch(url, requestOptions);
    } catch (error) {999
      console.error(error);
      return null;
    }
  }