import styled from "@emotion/styled";
import { margins, zIndex } from "../../design";
import { fadeIn } from "../atoms";

export const LeftItemContainer = styled.div`
  position: absolute;
  width: 310px;
  height: 408px;
  left: ${margins.big};
  bottom: ${margins.big};
  z-index: ${zIndex.overCharacter};
  animation: ${fadeIn} 10s;
`;

export const RightItemContainer = styled.div`
  position: absolute;
  width: 310px;
  height: 408px;
  right: 60px;
  bottom: ${margins.big};
  z-index: ${zIndex.overCharacter};
  animation: ${fadeIn} 10s;
`;

export const RightItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: -22px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin: 24px 0px;
`;

export const Conta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin: 24px 0px;
`;
