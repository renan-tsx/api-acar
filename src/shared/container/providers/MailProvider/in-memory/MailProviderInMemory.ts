import { IMailProvider } from "../IMailProvider";

export class MailProviderInMemory implements IMailProvider {
  private message: any[] = [];

  async sendMail(to: string, subject: string, variable: any, path: any): Promise<void> {
    this.message.push({
      to,
      subject,
      variable,
      path
    });
  }
}