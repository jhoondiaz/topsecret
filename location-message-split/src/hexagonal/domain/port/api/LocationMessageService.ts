export interface LocationMessageService {
  postLocationMessage(satelliteName: string, satelliteInfo: any): Promise<any>;
  getLocationMessage(satelliteName: string): Promise<any>;
}
