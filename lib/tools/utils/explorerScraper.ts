const options = {
    method: "GET",
    headers: {}, // Add any required headers here
    body: "{}"
};

export async function getAccountInfo(input: string) {
    try {
        const url = `https://api.minaexplorer.com/accounts/${input}`
        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}