import { Product } from '../../types';
import { SMARTPHONES_LAPTOPS } from './smartphones_laptops';
import { TABLETS_MONITORS } from './tablets_monitors';
import { PC_GAMING } from './pc_gaming';
import { AUDIO_WEARABLES } from './audio_wearables';
import { CAMERAS_NETWORKING_SMARTHOME } from './cameras_networking_smarthome';
import { ELECTRONICS_VENDORS } from './vendors';

export { ELECTRONICS_VENDORS } from './vendors';
export { SMARTPHONES_LAPTOPS } from './smartphones_laptops';
export { TABLETS_MONITORS } from './tablets_monitors';
export { PC_GAMING } from './pc_gaming';
export { AUDIO_WEARABLES } from './audio_wearables';
export { CAMERAS_NETWORKING_SMARTHOME } from './cameras_networking_smarthome';

export const ALL_ELECTRONICS_PRODUCTS: Product[] = [
  ...SMARTPHONES_LAPTOPS,
  ...TABLETS_MONITORS,
  ...PC_GAMING,
  ...AUDIO_WEARABLES,
  ...CAMERAS_NETWORKING_SMARTHOME
];
