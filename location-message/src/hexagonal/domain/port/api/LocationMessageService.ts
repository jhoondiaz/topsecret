export interface LocationMessageService {
  postLocationMessage(satellites: Array<any>): Promise<any>;
  postDistances(position: any): Promise<any>;
}
