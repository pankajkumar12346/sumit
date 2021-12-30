import { 
  IMAGE_INPUT,
  FACE_BOX } from './constants'

const initialStateSearch = {
  input: ''
};

export const imageSearch = (state=initialStateSearch, action={}) => {
  switch(action.type) {
    case IMAGE_INPUT:
      return Object.assign({}, state, {input: action.payload});
    default:
      return state;
  }
}

const StateOFBox = {
  box: {}
};

export const FaceBox = (state=StateOFBox, action={}) => {
  switch(action.type) {
    case FACE_BOX:
      return Object.assign({}, state, {box: action.payload});
    default:
      return state;
  }
}