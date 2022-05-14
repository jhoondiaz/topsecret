export interface LocationMessageService {
  postLocationMessage(data: Array<string>): Promise<any>;
}
