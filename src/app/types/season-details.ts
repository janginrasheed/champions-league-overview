import {Season} from './season';
import {GroupDetails} from './group-details';

export interface SeasonDetails extends Season{
  seasonGroups: GroupDetails[];
}
