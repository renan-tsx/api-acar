export interface IMailProvider {
  sendMail(
    to: string,
    subject: string,
    variable: any,
    path: any
    ): Promise<void>
}