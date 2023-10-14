import * as dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_URL}/`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any): Promise<any> {
    const accessToken = req.headers['authorization'];
    const userId = encodeURIComponent(payload.sub);
    const userInfoUrl = `${process.env.AUTH0_ISSUER_URL}/api/v2/users/${userId}`;
    const data = await fetch(userInfoUrl, {
      headers: {
        'Authorization': accessToken,
      },
    })
    const json = await data.json();

    return json;
  }
}
