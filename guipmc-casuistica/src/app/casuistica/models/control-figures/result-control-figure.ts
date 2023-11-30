
import { ContentControlFigures } from './content-control-figures';
import { Pageable } from '../paginator/pageable';
import { Sort } from '../paginator/sort';
export class ResultControlFigure {
  content: ContentControlFigures[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  sort: Sort;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}
