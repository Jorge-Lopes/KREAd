import { FC } from "react";

import { useViewport } from "../../hooks";

import { BaseCharacter, ErrorView, LoadingPage, MenuCard } from "../../components";
import { ItemWrapper } from "./styles";
import { useMyItems, useMyCharacter } from "../../service";
import { useParams } from "react-router-dom";
import { Character, Item } from "../../interfaces";

/**
 * TODO:
 * * This page needs to have the context / service of:
 *  * Selected Character
 *  * Selected character equipped items
 *  * Owned items
 */
export const ItemPage: FC = () => {
  const { category } = useParams<"category">();
  const [{ owned }, isLoadingItems] = useMyItems();
  const [
    {
      selected: [character],
      isLoading: isLoadingCharacter,
    },
  ] = useMyCharacter();
  const { height, width } = useViewport();

  // const categoryItems = [character.items[`${category}`]];
  const categoryItems = owned.filter((item: Item) => item.category === category);

  if (isLoadingItems || isLoadingCharacter) return <LoadingPage />;

  if (!category || !character) return <ErrorView />;

  return (
    <ItemWrapper height={height} position={category} width={width}>
      <BaseCharacter items={character.items} size="extraLarge" isZoomed />
      <MenuCard title={category} items={categoryItems} />
    </ItemWrapper>
  );
};
