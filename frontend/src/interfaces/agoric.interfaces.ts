interface AgoricService {
  zoe: any;
  board: any;
  zoeInvitationDepositFacetId: any;
  invitationIssuer: any;
  walletP: any;
  apiSend: any;
}

interface Contract {
  instance: any;
  publicFacet: any;
  instanceBoardId?: string;
}

interface Contracts {
  characterBuilder: Contract;
  auctions: Contract[];
}

interface Status {
  walletConnected: boolean;
  dappApproved: boolean;
  showApproveDappModal: boolean;
}

export interface Purses {
  money: any[];
  character: any[];
}

export interface ServiceState {
  status: Status;
  purses: Purses;
  contracts: Contracts;
  agoric: AgoricService;
  isLoading: boolean;
}

type PursePetname = [string, string];

interface SetDappApproved {
  type: "SET_DAPP_APPROVED";
  payload: boolean;
}

interface SetWalletConnected {
  type: "SET_WALLET_CONNECTED";
  payload: boolean;
}

interface SetShowApproveDappModal {
  type: "SET_SHOW_APPROVE_DAPP_MODAL";
  payload: boolean;
}

interface SetTokenPurses {
  type: "SET_TOKEN_PURSES";
  payload: any[];
}

interface SetCharacterPurses {
  type: "SET_CHARACTER_PURSES";
  payload: any[];
}

interface SetAgoric {
  type: "SET_AGORIC";
  payload: Omit<AgoricService, "apiSend">;
}
interface SetCharacterContract {
  type: "SET_CHARACTER_CONTRACT";
  payload: Contract;
}
interface SetAuctionContract {
  type: "ADD_AUCTION_CONTRACT";
  payload: Contract;
}
interface SetApiSend {
  type: "SET_APISEND";
  payload: any;
}
interface SetLoading {
  type: "SET_LOADING";
  payload: boolean;
}

interface Reset {
  type: "RESET";
}

export type ServiceDispatch = React.Dispatch<ServiceStateActions>;

export type ServiceStateActions =
  | Reset
  | SetDappApproved
  | SetWalletConnected
  | SetShowApproveDappModal
  | SetTokenPurses
  | SetCharacterPurses
  | SetAgoric
  | SetCharacterContract
  | SetAuctionContract
  | SetApiSend
  | SetLoading;
