enum UserActionKind {
  SET_FILTERS = "SET_FILTERS",
}

interface Action {
  type: UserActionKind;
  payload: any;
}

export interface UserState {
  filters: any;
}

export const initialState: UserState = {
  filters: {
    attributes: {
      forDisabledPeople: false,
      forSmartCar: false,
      forBicycle: false,
      forMotorcycle: false,
    },
    purpose: {
      forBuy: false,
      forBorrow: false,
    },
    sortBy: "PriceLowestHighest",
    price: 0,
    periodInDays: 0,
    periodInHours: 0,
    rule: "more",
  },
};

export const UserReducer = (state: UserState, action: Action): UserState => {
  const { type, payload } = action;

  switch (type) {
    case UserActionKind.SET_FILTERS: {
      return {
        ...state,
        filters: payload,
      };
    }
    default:
      return state;
  }
};
