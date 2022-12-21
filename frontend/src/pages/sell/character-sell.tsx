import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage, NotificationDetail, Overlay } from "../../components";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { CharacterDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useMyCharacter, useSellCharacter } from "../../service";
import { Sell } from "./sell";

export const CharacterSell = () => {
  const { id } = useParams<"id">();
  const navigate = useNavigate();

  const idString = String(id);
  const [showToast, setShowToast] = useState(false);
  const [data, isLoading] = useMyCharacter(idString);
  const sellCharacter = useSellCharacter(idString);

  const submitForm = async (price: number) => {
    const res = await sellCharacter.callback(price);
    if (res) {
      displayToast();
      console.info("Sell offer sent, redirecting to shop");
    } else {
      throw "There was a problem sending the sell offer to the wallet. Please try again later.";
    }
  };

  if (sellCharacter.isError) return <ErrorView />;

  if (sellCharacter.isSuccess) return <Navigate to={routes.shop} />;

  if (isLoading) return <LoadingPage spinner={false} />;

  if (!data) return <ErrorView />;

  const { nft, equippedItems } = data;

  const displayToast = () => {
    setShowToast(true);
  };

  const closeAndRedirect = () => {
    setShowToast(false);
    navigate(`${routes.shop}`);
  };

  return (
    <Sell
      isLoading={sellCharacter.isLoading}
      onSubmit={submitForm}
      text={{ sell: text.store.sellCharacter }}
      data={{ ...nft, image: equippedItems, category: nft.type, characterImage: nft.image }}
    >
      <FadeInOut show>
        <CharacterDetailSection character={data} showToast={displayToast} />
      </FadeInOut>
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showToast}>
          <NotificationDetail
            title={text.general.goToYourWallet}
            info={text.general.yourActionIsPending}
            closeToast={closeAndRedirect}
            isError
          />
        </NotificationWrapper>
      </FadeInOut>
    </Sell>
  );
};
