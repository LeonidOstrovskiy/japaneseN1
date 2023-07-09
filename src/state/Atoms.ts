import { atom } from 'recoil';

export type CurrentPageAtomType = {
  type: 'learn' | 'test' | 'login' | '';
  // lesson: number;
};

export const currentPageState = atom<CurrentPageAtomType>({
  key: 'currentPageState',
  default: {
    type: '',
    // lesson: 1,
  },
});
