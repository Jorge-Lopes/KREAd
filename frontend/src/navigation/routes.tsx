import { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useNavigate } from "react-router-dom";

import { routes } from "./route-names";
import { CharacterBuy, CharacterSell, CreateCharacter, Inventory, ItemBuy, ItemSell, Landing, Onboarding, Privacy, Shop } from "../pages";
import { MainContainer, ErrorFallback } from "../components";
import { Item } from "../pages/item";
import { TestServiceUI } from "../service/test-service-ui";

export const AppRoutes: FC = () => {
  const navigate = useNavigate();
  // const [service] = useAgoricContext();

  // if (service.isLoading) return <LoadingPage />;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.character)}>
      <MainContainer>
        <Routes>
          <Route path={routes.root} element={<Onboarding />} />
          {/* TODO: uncomment */}
          <Route path={routes.character} element={<Landing />} />
          <Route path={`${routes.items}/:category`} element={<Item />} />
          <Route path={routes.shop} element={<Shop />} />
          <Route path={routes.inventory} element={<Inventory />} />
          <Route path={routes.createCharacter} element={<CreateCharacter />} />

          <Route path={`${routes.buyItem}/:id`} element={<ItemBuy />} />
          <Route path={`${routes.buyCharacter}/:id`} element={<CharacterBuy />} />

          <Route path={`${routes.sellItem}/:id`} element={<ItemSell />} />
          <Route path={`${routes.sellCharacter}/:id`} element={<CharacterSell />} />
          <Route path={"/test"} element={<TestServiceUI />} />
          <Route path={routes.privacy} element={<Privacy />} />
        </Routes>
      </MainContainer>
    </ErrorBoundary>
  );
};
