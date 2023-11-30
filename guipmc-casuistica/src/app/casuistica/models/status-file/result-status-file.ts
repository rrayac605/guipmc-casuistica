import { FileInfo } from './file-info';
import { Pageable } from '../paginator/pageable';
import { Sort } from '../paginator/sort';
export class ResultStatusFile {
  content: FileInfo[];
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
