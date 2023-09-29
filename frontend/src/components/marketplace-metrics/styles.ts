import styled from "@emotion/styled";
import { ButtonText, fadeUp, HorizontalDivider } from "../atoms";
import { color, fontWeight } from "../../design";

export const MarketplaceMetricsWrapper = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  padding: 0;
  z-index: 30;
  ${HorizontalDivider} {
    margin-top: 4px;
  }
  animation: ${fadeUp} 1.2s ease-out 0s forwards;
  opacity: 0;
  transform: translate3d(0, 1rem, 0);
`;

export const MarketplaceMetricsContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  padding: 16px;
  border: 1px solid ${color.grey};
`;

export const MetricsTable = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

export const MetricsHeader = styled.div`
  display: flex;
  ${ButtonText} {
    font-size: 24px;
    font-weight: ${fontWeight.bold};
  }
`;

export const MetricsRow = styled.div`
  display: flex;
  ${ButtonText} {
    :first-letter {
      text-transform: none;
    }
  }
`;

export const LabelWrapper = styled.div`
  //flex: 1;
  //text-align: center;
  //width: 75px;
`;

export const Metric = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
`;

export const MetricText = styled(ButtonText)`
  font-size: 16px;
  :first-letter {
    text-transform: none;
  }
`;
