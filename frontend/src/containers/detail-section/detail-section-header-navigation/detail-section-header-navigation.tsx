import { FC } from "react";

import { DetailSectionHeaderNavigationWrap } from "./styles";
import { ButtonText, PriceInIst, PrimaryButton, SecondaryButton } from "../../../components";
import { ButtonClose } from "../../../components/button-close";
import { color } from "../../../design";
import { DetailSectionActions } from "../types";

interface HeaderNavigationProps {
  actions?: DetailSectionActions;
}

export const DetailSectionHeaderNavigation: FC<HeaderNavigationProps> = ({ actions }) => {
  if (!actions) return <DetailSectionHeaderNavigationWrap />;

  const { primary, secondary, onClose, price } = actions;

  return (
    <DetailSectionHeaderNavigationWrap>
      {!!price && <PriceInIst price={price} />}

      {!!primary && (
        <PrimaryButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => primary.onClick(event)}>
          <ButtonText customColor={color.white}>{primary.text}</ButtonText>
        </PrimaryButton>
      )}

      {!!secondary && (
        <SecondaryButton onClick={() => secondary.onClick()}>
          <ButtonText>{secondary.text}</ButtonText>
        </SecondaryButton>
      )}

      {!!onClose && <ButtonClose data-cy="close-button" onClick={() => onClose()} />}
    </DetailSectionHeaderNavigationWrap>
  );
};
