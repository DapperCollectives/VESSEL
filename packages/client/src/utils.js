import { SIGNER_RESPONSES } from 'constants/enums';
import { COIN_TYPE_TO_META, CONTRACT_NAME_TO_COIN_TYPE } from 'constants/maps';
import daysjs from 'dayjs';

export const checkResponse = async (response) => {
  if (!response.ok) {
    const { status, statusText, url } = response;
    const { error } = response.json ? await response.json() : {};
    throw new Error(
      JSON.stringify({ status, statusText: error || statusText, url })
    );
  }
  return response.json();
};

export const notifyError = (err, history, url) => {
  try {
    const response = JSON.parse(err.message);
    if (typeof response === 'object') {
      history.replace(history.location.pathname, response);
    }
  } catch (error) {
    history.replace(history.location.pathname, {
      status: 500,
      statusText: `Server not available: ${err.message}`,
      url,
    });
  }
};

export const shortenString = (string) => {
  if (!string) return string;
  const firstChunk = string.slice(0, 4);
  const secondChunk = string.slice(string.length - 4, string.length);
  return `${firstChunk}...${secondChunk}`;
};

// rudimentary address check before actually querying with bad inputs
export const isAddr = (addr) => {
  // remove special chars
  addr = addr.replace(/[^a-z0-9]/gi, '');
  // remove 0x prefix if exists
  const noPrefix = addr.startsWith('0x') ? addr.replace('0x', '') : addr;
  // result should be 16 chars long
  return noPrefix.length === 16;
};
export const formatAddress = (addr) =>
  addr.startsWith('0x') ? addr : `0x${addr}`;

export const formatActionString = (str) => {
  const vaultRegex = /A\..*\.Vault/g;
  const collectionRegex = /A\..*\.Collection/g;
  const floatRegex = /[0-9]*[.][0-9]+/;
  const isTokenTransfer = vaultRegex.test(str);
  const isNFTTransfer = collectionRegex.test(str);
  let contractName;
  let result;
  if (isTokenTransfer) {
    contractName = str.match(vaultRegex)[0].split('.')[2];
    const tokenName = CONTRACT_NAME_TO_COIN_TYPE[contractName];
    result = str.replace(floatRegex, parseFloat(str.match(floatRegex)[0]));
    return result.replace(vaultRegex, tokenName);
  }
  if (isNFTTransfer) {
    contractName = str.match(collectionRegex)[0].split('.')[2];
    return str.replace(collectionRegex, contractName);
  }
  return str;
};

export const getProgressPercentageForSignersAmount = (signersAmount) =>
  Math.min(60 + signersAmount * 10, 100);

export const getFlowscanUrlForTransaction = (hash) =>
  `https://${
    process.env.REACT_APP_FLOW_ENV === 'mainnet' ? '' : 'testnet.'
  }flowscan.org/transaction/${hash}`;

export const getFlowscanUrlForContract = (address, name) =>
  `https://${
    process.env.REACT_APP_FLOW_ENV === 'mainnet' ? '' : 'testnet.'
  }flowscan.org/contract/A.${address}.${name}`;

export const syncSafeOwnersWithSigners = (signers, safeOwners) => {
  const verifiedSigners = Object.keys(signers).filter((key) => signers[key]);

  const updatedOwners = verifiedSigners.map((address) => {
    const owner = safeOwners.find(
      (owner) => formatAddress(owner.address) === formatAddress(address)
    );
    return {
      name: owner?.name,
      address,
      verified: true,
    };
  });
  return updatedOwners;
};
export const getVaultId = (identifiers, coinType) => {
  const vaultIdentifiers = identifiers[0] ?? [];
  return vaultIdentifiers.find(
    (id) => id.indexOf(COIN_TYPE_TO_META[coinType].vaultName) >= 0
  );
};

export const removeAddressPrefix = (address) => address.replace('0x', '');

export const getTokenMeta = (vaultId) => {
  if (vaultId) {
    const tokenName = vaultId.split('.')[2];
    const tokenAddress = vaultId.split('.')[1];
    const tokenType = CONTRACT_NAME_TO_COIN_TYPE[tokenName];
    return {
      ...COIN_TYPE_TO_META[CONTRACT_NAME_TO_COIN_TYPE[tokenName]],
      tokenAddress,
      tokenType,
    };
  }
  return {};
};

// This can be used to fetch the contract name and address for vault and collection identifiers
export const parseIdentifier = (identifier) => {
  if (!identifier) {
    return {};
  }
  const contractName = identifier.split('.')[2];
  const contractAddress = identifier.split('.')[1];
  return {
    contractName,
    contractAddress,
  };
};

export const getNameByAddress = (nameAddressArray, addr) => {
  const nameAddress = nameAddressArray.find(({ address }) => address === addr);
  return nameAddress?.name ?? addr;
};

export const parseTimestamp = (timestamp) => {
  // Timestamp returned from cadence is in ufix64 -> so we have to make it to an integer first
  const parsedDate = daysjs(parseInt(timestamp) * 1000);

  const date = parsedDate.format('M/DD/YYYY');
  const time = parsedDate.format('HH:MM A');
  return `${date} at ${time}`;
};

export const getStatusColor = (confirmation) => {
  switch (confirmation) {
    case SIGNER_RESPONSES.APPROVED:
      return 'success';
    case SIGNER_RESPONSES.REJECTED:
      return 'danger';
    case SIGNER_RESPONSES.PENDING:
    default:
      return 'warning';
  }
};
