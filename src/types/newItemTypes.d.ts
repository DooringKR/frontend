export type DoorItem = {
  category: "door";
  door_type: string;
  door_color: string;
  door_width: number;
  door_height: number;
  hinge_count: number;
  hinge_direction: string;
  first_hinge: number | null;
  second_hinge: number | null;
  third_hinge: number | null;
  fourth_hinge: number | null;
  door_location: string | null;
  count: number;
  price: number;
  cartItemId?: number;
};

export type AccessoryItem = {
  category: "accessory";
  accessory_type: string;
  accessory_madeby: string;
  accessory_model: string;
  accessory_request: string | null;
  count: number;
  price: number;
  cartItemId?: number;
};

export type CabinetItem = {
  category: "cabinet";
  cabinet_type: string;
  cabinet_color: string;
  cabinet_width: number;
  cabinet_height: number;
  cabinet_depth: number;
  cabinet_location: string | null;
  cabinet_request: string | null;
  handle_type: string | null;
  finish_type: string;
  body_type: string;
  body_type_direct_input: string | null;
  absorber_type: string | null;
  absorber_type_direct_input: string | null;
  drawer_type: string | null;
  rail_type: string | null;
  add_rice_cooker_rail: boolean;
  add_bottom_drawer: boolean;
  // bodyMaterial: string;
  // handleType: string;
  // showBar: string;
  // drawerType: string;
  // railType: string;
  // riceRail?: string;
  // lowerDrawer?: string;
  count: number;
  price: number;
  cartItemId?: number;
};

export type FinishItem = {
  category: "finish";
  finish_color: string;
  finish_base_depth: number;
  finish_additional_depth: number | null;
  finish_base_height: number;
  finish_additional_height: number | null;
  finish_location: string | null;
  finish_request: string | null;
  count: number;
  price: number;
  cartItemId?: number;
};

export type HardwareItem = {
  category: "hardware";
  hardware_type: string;
  hardware_madeby: string;
  hardware_size: string;
  hardware_request: string | null;
  count: number;
  price: number;
  cartItemId?: number;
};
