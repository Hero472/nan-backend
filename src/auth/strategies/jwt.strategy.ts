import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { StudentService } from '../../student/student.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly studentsService: StudentService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Optionally, you can handle expired tokens
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Here, the payload will contain the data you put in the token (e.g., sub and email)
    const student = this.studentsService.findOne(payload.sub);
    if (!student) {
      throw new UnauthorizedException('Invalid token');
    }
    return student; // Return the student, which will be attached to the request object
  }
}