import { FC } from "react";
import { text } from "../../assets";
import { BaseRoute, ButtonText, ErrorView, Filters, HorizontalDivider, Label, LoadingPage, SecondaryButton, ShopCard, SwitchSelector } from "../../components";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { useItems } from "../../service";
import {
  FilterContainer,
  FilterWrapper,
  ItemContainer,
  ItemWrapper,
  LoadMore,
  Refresh,
  SelectorContainer,
  ShopWrapper,
  SortByContainer
} from "./styles";

export const Shop: FC = () => {
  const { data: items, isLoading: isLoadingItems } = useItems();
  const { height } = useViewport();

  if (isLoadingItems) return <LoadingPage />;

  if (!items || !items.length) return <ErrorView />;

  return (
    // TODO: Add side bar component
    <BaseRoute sideNavigation={undefined}>
      <ShopWrapper>
        <FilterWrapper>
          <FilterContainer>
            <SelectorContainer>
              <SwitchSelector buttonOneText={text.character.items} buttonTwoText={text.character.characters} />
              {/* TODO: add filters children component */}
              <Filters label={text.general.category}></Filters>
              <Filters label={text.general.price} />
              <Filters label={text.general.color} />
            </SelectorContainer>
            <SortByContainer>
              <Label customColor={color.black}>{text.general.sortBy}</Label>
              <Filters label={text.general.color} />
            </SortByContainer>
          </FilterContainer>
          <HorizontalDivider />
        </FilterWrapper>
        <ItemWrapper height={height}>
          <ItemContainer>
            {items.map((item, index) => (
              <ShopCard item={item} key={index} />
            ))}
          </ItemContainer>
          {/* TODO: do something with load more */}
          <LoadMore>
            <SecondaryButton><ButtonText>{text.general.loadMore}</ButtonText><Refresh /></SecondaryButton>
          </LoadMore>
        </ItemWrapper>
      </ShopWrapper>
    </BaseRoute>
  );
};
