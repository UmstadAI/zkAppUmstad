const options = {
    method: "GET",
    headers: {}, // Add any required headers here
};

export async function getAccountInfo(input: string) {
    try {
        const url = `https://api.minaexplorer.com/accounts/${input}`
        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function getBlockInfo(input: string) {
    try {
        const url = `https://api.minaexplorer.com/blocks/${input}`
        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function getLatestBlock() {
    try {
        const url = `https://api.minaexplorer.com/blocks`
        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function getBlockchainSummary() {
    try {
        const url = `https://api.minaexplorer.com/summary`
        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}