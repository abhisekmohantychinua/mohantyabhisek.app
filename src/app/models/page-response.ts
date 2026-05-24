export default interface PageResponse<T> {
  items: T[];
  currentIndex: number;
  isLastIndex: boolean;
}
