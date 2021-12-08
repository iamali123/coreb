import {
  GET_PURCHASE_INQUIRY,
  ADD_PURCHASE_INQUIRY,
  DELETE_PURCHASE_INQUIRY,
  EDIT_PURCHASE_INQUIRY,
  GET_PURCHASE_INQUIRY_SUMMARY,
  EDIT_PURCHASE_INQUIRY_SUMMARY,
  DELETE_PURCHASE_INQUIRY_SUMMARY,
  ADD_PURCHASE_INQUIRY_SUMMARY,
} from "../Constants";
export function purchaseInquiryReducer(purchaseInquiryState = [], action) {
  switch (action.type) {
    case GET_PURCHASE_INQUIRY:
      return action.payload;
    case ADD_PURCHASE_INQUIRY:
      return [...purchaseInquiryState, action.payload];
    case DELETE_PURCHASE_INQUIRY:
      return purchaseInquiryState.filter(
        (purchaseInquiry) =>
          purchaseInquiry.purchaseInquiryId !== action.payload.toString()
      );
    case EDIT_PURCHASE_INQUIRY:
      return purchaseInquiryState.map((purchaseInquiry) => {
        if (
          purchaseInquiry.purchaseInquiryId === action.payload.purchaseInquiryId
        ) {
          return {
            ...purchaseInquiry,
            ...action.payload,
          };
        } else {
          return purchaseInquiry;
        }
      });
    default:
      return purchaseInquiryState;
  }
}
export function purchaseInquirySummaryReducer(
  purchaseInquirySummaryState = [],
  action
) {
  switch (action.type) {
    case GET_PURCHASE_INQUIRY_SUMMARY:
      return action.payload;
    case ADD_PURCHASE_INQUIRY_SUMMARY:
      return [...purchaseInquirySummaryState, action.payload];
    case DELETE_PURCHASE_INQUIRY_SUMMARY:
      return purchaseInquirySummaryState.filter(
        (summary) => summary.purchaseInquiryId !== action.payload.toString()
      );
    case EDIT_PURCHASE_INQUIRY_SUMMARY:
      return purchaseInquirySummaryState.map((summary) => {
        if (summary.purchaseInquiryId === action.payload.purchaseInquiryId) {
          return {
            ...summary,
            ...action.payload,
          };
        } else {
          return summary;
        }
      });
    default:
      return purchaseInquirySummaryState;
  }
}

export default { purchaseInquiryReducer, purchaseInquirySummaryReducer };
