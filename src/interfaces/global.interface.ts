export interface ResponseType {
  message: string;
  data: any;
  statusCode: number;
  date: Date;
}

export interface DecodedAccecssTokenType {
  id: string;
  username: string;
  key: string | number;
  iat?: string | number;
  exp?: string | number;
}
