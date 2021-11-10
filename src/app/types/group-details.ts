import {Club} from './club';
import {Group} from './group';

export interface GroupDetails extends Group {
  groupClubs: Club[];
  seasonId: number;
}
