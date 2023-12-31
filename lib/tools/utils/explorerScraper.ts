'use server';

const options = {
  method: 'GET',
  headers: {} // Add any required headers here
}

export async function getAccountInfo(input: string) {
  try {
    const url = `https://api.minaexplorer.com/accounts/${input}`
    const response = await fetch(url, options)
    const data = await response.json()

    if (!response.ok) {
      return 'Cannot fetch the API, the account is not exits or response is not OK'
    }

    delete data.account.epochStakingAccount
    delete data.account.nextEpochStakingAccount
    delete data.account.epochDelegators
    delete data.account.nextEpochDelegators

    return JSON.stringify(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    return 'Cannot get the account from explorer. Perhaps it does not exist.'
  }
}

export async function getBlockInfo(input: string) {
  try {
    const url = `https://api.minaexplorer.com/blocks/${input}`
    const response = await fetch(url, options)

    if (!response.ok) {
      return 'Cannot fetch the API, the input is wrong or response is not OK'
    }

    return await response.text()
  } catch (error) {
    console.error('Error fetching data:', error)
    return 'Cannot get the block info. Perhaps it does not exist.'
  }
}

export async function getLatestBlock() {
  try {
    const url = `https://api.minaexplorer.com/blocks`
    const response = await fetch(url, options)

    if (!response.ok) {
      return 'Cannot fetch the API, the input is wrong or response is not OK'
    }

    return await response.text()
  } catch (error) {
    console.error('Error fetching data:', error)
    return 'Cannot get the latest block. Maybe there is some issue in the API'
  }
}

export async function getBlockchainSummary() {
  try {
    const url = `https://api.minaexplorer.com/summary`
    const response = await fetch(url, options)

    if (!response.ok) {
      return 'Cannot fetch the API, the input is wrong or response is not OK'
    }

    return await response.text()
  } catch (error) {
    console.error('Error fetching data:', error)
    return 'Cannot get the blockchain summary. Maybe there is some issue in the API'
  }
}

export async function getCurrentPrice() {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=mina-protocol&vs_currencies=usd`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      mode: 'cors',
  })

    if (!response.ok) {
      return 'Cannot fetch the API, response is not OK'
    }

    return await response.text()
  } catch (error) {
    console.error('Error fetching data:', error)
    return 'Cannot get the current price because there is something with coingecko api.'
  }
}
