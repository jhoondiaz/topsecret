export interface LocationMessageService {
  postLocationMessage(satellites: Array<any>): Promise<any>;
}
