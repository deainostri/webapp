//
export const dAppName = "deainostri";
export const decimals = 2;
export const denomination = 18;
export const gasPrice = 1000000000;
export const version = 1;
export const gasLimit = 50000;
export const gasPerDataByte = 1500;

export const walletConnectBridge = "https://bridge.walletconnect.org";
export const walletConnectDeepLink =
  "https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/";

export const contracts = {
  owner: process.env.NEXT_PUBLIC_OWNER_SC_ADDRESS!,
  dns: process.env.NEXT_PUBLIC_DEAINOSTRI_SC_ADDRESS!,
  staking: process.env.NEXT_PUBLIC_DEAINOSTRI_STAKING_SC_ADDRESS!,
};

export const token = {
  nftTokenId: process.env.NEXT_PUBLIC_DEAINOSTRI_TOKEN!,
};

export const network = {
  id: process.env.NEXT_PUBLIC_NETWORK_ID!,
  name: process.env.NEXT_PUBLIC_NETWORK_ID!,
  egldLabel: process.env.NEXT_PUBLIC_EGLD_LABEL!,
  walletAddress: process.env.NEXT_PUBLIC_URLS_WALLET!,
  apiAddress: process.env.NEXT_PUBLIC_URLS_API!,
  gatewayAddress: process.env.NEXT_PUBLIC_URLS_GATEWAY!,
  explorerAddress: process.env.NEXT_PUBLIC_URLS_EXPLORER!,
  urls: {
    GATEWAY: process.env.NEXT_PUBLIC_URLS_GATEWAY!,
    API: process.env.NEXT_PUBLIC_URLS_API!,
    GRAPHQL: process.env.NEXT_PUBLIC_URLS_EXCHANGE_GARPHQL!,
    EXPLORER: process.env.NEXT_PUBLIC_URLS_EXPLORER!,
  },
};

const AppConfigs = {
  dAppName,
  decimals,
  denomination,
  gasPrice,
  version,
  gasLimit,
  gasPerDataByte,
  walletConnectBridge,
  walletConnectDeepLink,
  contracts,
  network,
  token,
};

export default AppConfigs;
