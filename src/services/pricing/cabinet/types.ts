import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CabinetHandleType, CabinetRailType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

export type CabinetPricingOptions = {
  bodyMaterialDirectInput?: string | null;
  drawerType?: number | null;
  drawerTypeDirectInput?: string | null;
  railType?: CabinetRailType | string | null;
  railTypeDirectInput?: string | null;
  absorberType?: number | null;
  absorberTypeDirectInput?: string | null;
};

export type CabinetPricingInput = {
  category: DetailProductType;
  color: string;
  width: number;
  bodyType: number;
  handleType: CabinetHandleType;
  depth: number;
  options?: CabinetPricingOptions;
};
