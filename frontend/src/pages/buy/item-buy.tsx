import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { ItemDetailSection } from "../../containers/detail-section";
import { ItemInMarket } from "../../interfaces";
import { useBuyItem, useItemFromMarket, useMyItem } from "../../service";
import { Buy } from "./buy";

export const ItemBuy = () => {
  const { id } = useParams<"id">();

  const idString = String(id);

  const [itemInMarket, isLoadingItem] = useItemFromMarket(idString);
  const [boughtItem] = useMyItem(idString);

  const buyItem = useBuyItem(idString);

  const [isAwaitingApproval, setIsAwaitingApproval] = useState(false);
  const [data, setData] = useState<ItemInMarket>();

  useEffect(() => {
    // without this, the view will error out after purchase, since the item won't be on the market anymore
    if (itemInMarket) setData(itemInMarket);
  }, [itemInMarket]);

  useEffect(() => {
    // TODO: handle declining item and error
    if (boughtItem && !buyItem.isLoading) setIsAwaitingApproval(false);
  }, [boughtItem, buyItem.isLoading]);

  const handleSubmit = () => {
    if (!id) return;
    setIsAwaitingApproval(true);
    buyItem.callback();
  };

  if (isLoadingItem) return <LoadingPage spinner={false} />;

  if (!data) return <ErrorView />;

  return (
    <Buy
      data={{ ...data.item, price: Number(data.sell.price) }}
      onSubmit={handleSubmit}
      isLoading={isAwaitingApproval}
      isOfferAccepted={!!boughtItem}
      text={{
        buy: text.store.buyItem,
        success: text.store.itemSuccessfullyBought,
        successLong: text.store.yourNewItemIs,
        check: text.store.checkItem,
      }}
    >
      <FadeInOut show>
        <ItemDetailSection item={data.item} />
      </FadeInOut>
    </Buy>
  );
};
